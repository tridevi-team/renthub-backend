import { raw } from "objection";
import { Action, EPagination, messageResponse } from "../enums";
import type { Filter, HouseCreate, HouseServiceInfo, HouseUpdate } from "../interfaces";
import { HouseFloors, Houses, Rooms, Services } from "../models";
import { ApiException, camelToSnake, filterHandler, sortingHandler } from "../utils";

class HouseService {
    static async getHouseByUser(userId: string, data?: Filter) {
        const { filter = [], sort = [], pagination } = data || {};

        const { page = EPagination.DEFAULT_PAGE, pageSize = EPagination.DEFAULT_LIMIT } = pagination || {};

        let list = Houses.query()
            .leftJoin("user_roles", "houses.id", "user_roles.house_id")
            .leftJoin("roles", "user_roles.role_id", "roles.id")
            .where((builder) => {
                builder.where("houses.created_by", userId).orWhere("user_roles.user_id", userId);
            })
            .select("houses.*", "roles.permissions");

        if (!data) {
            const fetchData = await list;
            const fullPermissions = {
                house: { create: false, read: true, update: true, delete: true },
                role: { create: true, read: true, update: true, delete: true },
                room: { create: true, read: true, update: true, delete: true },
                renter: { create: true, read: true, update: true, delete: true },
                service: { create: true, read: true, update: true, delete: true },
                bill: { create: true, read: true, update: true, delete: true },
                equipment: { create: true, read: true, update: true, delete: true },
                payment: { create: true, read: true, update: true, delete: true },
            };

            const enhancedList = fetchData.map((house) => {
                if (house.createdBy === userId) {
                    house.permissions = fullPermissions;
                }
                return house;
            });
            return enhancedList;
        }

        // Filter
        list = filterHandler(list, filter);

        // Sort
        list = sortingHandler(list, sort);

        const clone = list.clone();
        const total = await clone.resultSize();
        const totalPages = Math.ceil(total / pageSize);

        // Pagination
        if (page !== -1 && pageSize !== -1) await list.page(page - 1, pageSize);
        else await list.page(0, total);

        const fetchData = await list;

        return { ...fetchData, page, pageCount: totalPages, pageSize, total };
    }

    static async isRoomInHouse(houseId: string, roomId: string) {
        const room = await Rooms.query().joinRelated("floor.house").findOne({ "rooms.id": roomId, house_id: houseId });
        return !!room;
    }

    static async search(data: Filter) {
        const {
            filter = [],
            sort = [],
            pagination: { page = EPagination.DEFAULT_PAGE, pageSize = EPagination.DEFAULT_LIMIT } = {},
        } = data || {};

        let query = Houses.query()
            .join("house_floors as floors", "floors.house_id", "houses.id")
            .join("rooms", "floors.id", "rooms.floor_id");

        // Filter
        query = filterHandler(query, filter);

        // Sort
        query = sortingHandler(query, sort);

        query
            .select(
                raw("houses.id as id"),
                raw("houses.name as name"),
                raw("houses.address as address"),
                raw("houses.description as description"),
                raw("houses.collection_cycle as collection_cycle"),
                raw("MIN(max_renters) as min_renters"),
                raw("MAX(max_renters) as max_renters"),
                raw("MIN(price) as min_price"),
                raw("MAX(price) as max_price"),
                raw("COUNT(`rooms`.`id`) as num_of_rooms"),
                raw("MIN(`rooms`.`room_area`) as min_room_area"),
                raw("MAX(`rooms`.`room_area`) as max_room_area"),
                raw(
                    "(SELECT room_images.image_url FROM room_images WHERE room_images.room_id = `rooms`.id ORDER BY RAND() LIMIT 1) as thumbnail"
                )
            )
            .groupBy("houses.id", "houses.name", "houses.address", "houses.description");

        const totalQuery = query.clone();
        const total = await totalQuery.resultSize();
        const totalPages = Math.ceil(total / pageSize);

        if (page === -1 && pageSize === -1) await query.page(0, total);
        else await query.page(page - 1, pageSize);

        const fetchData = await query;

        return {
            ...fetchData,
            total,
            page,
            pageCount: totalPages,
            pageSize,
        };
    }

    static async getHouseById(houseId: string) {
        const details = await Houses.query().findById(houseId);
        if (!details) throw new ApiException(messageResponse.HOUSE_NOT_FOUND, 404);

        return details;
    }

    static async getHouseWithRooms(houseId: string) {
        const details = await Houses.query()
            .withGraphJoined("floors(idAndName).rooms(basic).[services(basic), images(imageUrl)]")
            .findById(houseId)
            .select("houses.id", "houses.name", "houses.address", "houses.description", "houses.collection_cycle");

        if (!details) {
            throw new ApiException(messageResponse.HOUSE_NOT_FOUND, 404);
        }

        return details;
    }

    static async create(data: HouseCreate) {
        const house = await Houses.query().findOne({
            name: data.name,
            created_by: data.createdBy,
        });

        if (house) throw new ApiException(messageResponse.HOUSE_ALREADY_EXISTS, 409);

        const houseData = {
            name: data.name,
            address: data.address,
            description: data.description,
            collectionCycle: data.collectionCycle,
            invoiceDate: data.invoiceDate,
            contractDefault: data.contractDefault,
            status: data.status,
            numCollectDays: data.numCollectDays,
            createdBy: data.createdBy,
        };

        const addNewHouse = await Houses.query().insertAndFetch(camelToSnake(houseData));
        for (let i = 0; i < data.numOfFloors; i++) {
            const floorData = {
                houseId: addNewHouse.id,
                name: "Tầng " + (i + 1),
                createdBy: data.createdBy,
            };
            const addNewFloor = await HouseFloors.query().insertAndFetch(camelToSnake(floorData));
            for (let j = 0; j < data.numOfRoomsPerFloor; j++) {
                const roomData = {
                    floorId: addNewFloor.id,
                    name: "Phòng " + (j + 1),
                    maxRenters: data.maxRenters,
                    roomArea: data.roomArea,
                    price: data.roomPrice,
                    createdBy: data.createdBy,
                };

                await Rooms.query().insertAndFetch(camelToSnake(roomData));
            }
        }

        const dataCreated = await Houses.query().withGraphJoined("floors.rooms").findById(addNewHouse.id);
        return dataCreated;
    }

    static async update(houseId: string, data: HouseUpdate) {
        const details = await this.getHouseById(houseId);

        // check if house name already exists
        if (data.name && data.name !== details.name) {
            const house = await Houses.query().findOne({
                name: data.name,
                created_by: details.createdBy,
            });

            if (house) throw new ApiException(messageResponse.HOUSE_ALREADY_EXISTS, 409);
        }

        await details.$query().patch(camelToSnake(data));

        return details;
    }

    static async updateStatus(houseId: string, status: boolean) {
        const details = await this.getHouseById(houseId);

        await details.$query().patch({ status });
        return { houseId, status: details.status };
    }

    static async delete(houseId: string) {
        const details = await this.getHouseById(houseId);

        const deletedRow = await details.$query().delete();

        const isDelete = deletedRow > 0;
        return isDelete;
    }

    static async isOwner(userId: string, houseId: string) {
        const house = await Houses.query().findOne(camelToSnake({ id: houseId, createdBy: userId }));
        return !!house;
    }

    static async isAccessible(userId: string, houseId: string, action: string) {
        const housePermissions = await Houses.query()
            .leftJoin("user_roles", "houses.id", "user_roles.house_id")
            .leftJoin("roles", "user_roles.role_id", "roles.id")
            .where("houses.id", houseId)
            .andWhere("user_roles.user_id", userId)
            .select("roles.permissions")
            .first();
        if (!housePermissions?.permissions) return false;
        else if (action === Action.READ) {
            return (
                housePermissions.permissions.house.read ||
                housePermissions.permissions.house.update ||
                housePermissions.permissions.house.delete
            );
        }
        return housePermissions.permissions.house[action];
    }

    static async createService(houseId: string, data: HouseServiceInfo) {
        const serviceDetails = await Services.query().findOne(
            camelToSnake({
                name: data.name,
                houseId,
            })
        );
        if (serviceDetails) throw new ApiException(messageResponse.SERVICE_ALREADY_EXISTS, 409);

        const newService = await Services.query().insertAndFetch(camelToSnake({ ...data, houseId }));

        return newService;
    }

    static async getServiceDetails(serviceId: string) {
        const serviceDetails = await Services.query().findById(serviceId);
        if (!serviceDetails) throw new ApiException(messageResponse.SERVICE_NOT_FOUND, 404);

        return serviceDetails;
    }

    static async listServicesByHouse(houseId: string, filterData?: Filter) {
        const {
            filter = [],
            sort = [],
            pagination: { page = EPagination.DEFAULT_PAGE, pageSize = EPagination.DEFAULT_LIMIT } = {},
        } = filterData || {};

        let query = Services.query().where("house_id", houseId);

        // Filter
        query = filterHandler(query, filter);

        // Sort
        query = sortingHandler(query, sort);

        const totalQuery = query.clone();
        const total = await totalQuery.resultSize();

        if (total === 0) throw new ApiException(messageResponse.NO_SERVICES_FOUND, 404);

        const totalPages = Math.ceil(total / pageSize);

        if (page === -1 && pageSize === -1) await query.page(0, total);
        else await query.page(page - 1, pageSize);

        const fetchData = await query;

        return { ...fetchData, total, page, pageCount: totalPages, pageSize };
    }

    static async updateService(serviceId: string, data: HouseServiceInfo) {
        const serviceDetails = await Services.query().findById(serviceId);
        if (!serviceDetails) throw new ApiException(messageResponse.SERVICE_NOT_FOUND, 404);

        const serviceNameExists = await Services.query().findOne(
            camelToSnake({
                name: data.name,
                houseId: serviceDetails.houseId,
            })
        );

        if (serviceNameExists && serviceDetails.id !== serviceId)
            throw new ApiException(messageResponse.SERVICE_ALREADY_EXISTS, 409);

        const updatedService = await serviceDetails.$query().patchAndFetch(camelToSnake(data));

        return updatedService;
    }

    static async deleteService(serviceId: string, deletedBy: string) {
        const serviceDetails = await Services.query().findById(serviceId);
        if (!serviceDetails) throw new ApiException(messageResponse.SERVICE_NOT_FOUND, 404);

        await serviceDetails.$query().patch(camelToSnake({ updatedBy: deletedBy }));

        const deletedService = await serviceDetails.$query().delete();

        const isDeleted = deletedService > 0;
        return isDeleted;
    }
}

export default HouseService;
