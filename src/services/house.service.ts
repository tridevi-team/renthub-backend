import { raw } from "objection";
import { Action, RoomStatus } from "../enums";
import messageResponse from "../enums/message.enum";
import type { HouseCreate, HouseFilter, HouseServiceInfo, HouseUpdate } from "../interfaces";
import { HouseFloors, Houses, Rooms, Services } from "../models";
import { ApiException } from "../utils";
import camelToSnake from "../utils/camelToSnake";

class HouseService {
    static async getHouseByUser(userId: string) {
        const list = await Houses.query()
            .leftJoin("user_roles", "houses.id", "user_roles.house_id")
            .leftJoin("roles", "user_roles.role_id", "roles.id")
            .where("houses.created_by", userId)
            .orWhere("user_roles.user_id", userId)
            .select("houses.*", "roles.permissions");

        const fullPermissions = {
            house: { create: false, read: true, update: true, delete: true },
            role: { create: true, read: true, update: true, delete: true },
            room: { create: true, read: true, update: true, delete: true },
            renter: { create: true, read: true, update: true, delete: true },
            service: { create: true, read: true, update: true, delete: true },
            bill: { create: true, read: true, update: true, delete: true },
            equipment: { create: true, read: true, update: true, delete: true },
        };

        const enhancedList = list.map((house) => {
            if (house.createdBy === userId) {
                house.permissions = fullPermissions;
            }
            return house;
        });
        return enhancedList;
    }

    static async search(data: HouseFilter) {
        const query = Houses.query().joinRelated("floors.rooms").where("houses.status", true).andWhere("floors:rooms.status", RoomStatus.AVAILABLE);

        if (data.keyword) {
            query.where("houses.name", "like", `%${data.keyword}%`);
        }

        if (data.address) {
            query.modifiers({
                address(query) {
                    if (data.address.city) {
                        query.where("city", "like", `%${data.address.city}%`);
                    }
                    if (data.address.district) {
                        query.where("district", "like", `%${data.address.district}%`);
                    }
                    if (data.address.ward) {
                        query.where("ward", "like", `%${data.address.ward}%`);
                    }
                    if (data.address.street) {
                        query.where("street", "like", `%${data.address.street}%`);
                    }
                },
            });
        }

        if (data.numOfBeds) {
            query
                .where("floors:rooms.description", "like", `%${data.numOfBeds} ngu%`)
                .orWhere("floors:rooms.description", "like", `%${data.numOfBeds}n%`);
        }

        if (data.numOfRenters) {
            query.where("floors:rooms.max_renters", ">=", data.numOfRenters);
        }

        if (data.price?.from) {
            query.where("floors:rooms.price", ">=", data.price.from);
        }

        if (data.price?.to) {
            query.where("floors:rooms.price", "<=", data.price.to);
        }

        if (data.roomArea) {
            query.where("floors:rooms.room_area", ">=", data.roomArea);
        }

        if (data.sortBy && data.orderBy) {
            query.orderBy(`houses.${data.sortBy}`, data.orderBy);
        }

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
                raw("COUNT(`floors:rooms`.`id`) as num_of_rooms"),
                raw("MIN(`floors:rooms`.`room_area`) as min_room_area"),
                raw("MAX(`floors:rooms`.`room_area`) as max_room_area"),
                raw(
                    "(SELECT room_images.image_url FROM room_images WHERE room_images.room_id = `floors:rooms`.id ORDER BY RAND() LIMIT 1) as thumbnail"
                )
            )
            .groupBy("houses.id", "houses.name", "houses.address", "houses.description");

        const totalQuery = query.clone();
        const count = await totalQuery.resultSize();
        query.offset((data.page - 1) * data.limit).limit(data.limit);

        const fetchData = await query;

        return {
            results: fetchData,
            total: count,
            page: data.page,
            limit: data.limit,
        };
    }

    static async getHouseById(houseId: string) {
        const details = await Houses.query().findById(houseId);
        if (!details) throw new ApiException(messageResponse.HOUSE_NOT_FOUND, 404);

        return details;
    }

    static async getHouseWithRooms(houseId: string) {
        const details = await Houses.query()
            .withGraphJoined("floors.rooms.[services.service, images]")
            .findById(houseId)
            .select("houses.id", "houses.name", "houses.address", "houses.description", "houses.collection_cycle")
            .modifyGraph("floors", (builder) => {
                builder.select("id", "name");
            })
            .modifyGraph("floors.rooms", (builder) => {
                builder.select("id", "name", "max_renters", "room_area", "price", "description", "status");
            })
            .modifyGraph("floors.rooms.services.service", (builder) => {
                builder.select("id", "name", "unit_price", "description");
            })
            .modifyGraph("floors.rooms.images", (builder) => {
                builder.select("id", "imageUrl");
            });

        if (!details) {
            throw new ApiException(messageResponse.HOUSE_NOT_FOUND, 404);
        }

        // Flatten the data structure and return a simplified object
        return {
            ...details,
            floors: details.floors.map((floor) => ({
                ...floor,
                rooms: floor.rooms.map((room) => ({
                    ...room,
                    services: room.services.map((service) => ({
                        ...service.service, // Flatten the service details
                        quantity: service.quantity, // Keep quantity
                    })),
                    images: room.images.map((image) => image.imageUrl), // Map only image URLs
                })),
            })),
        };
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
            return housePermissions.permissions.house.read || housePermissions.permissions.house.update || housePermissions.permissions.house.delete;
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

    static async listServicesByHouse(houseId: string) {
        const services = await Services.query().where("house_id", houseId);
        if (services.length === 0) throw new ApiException(messageResponse.NO_SERVICES_FOUND, 404);

        return services;
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

        if (serviceNameExists && serviceDetails.id !== serviceId) throw new ApiException(messageResponse.SERVICE_ALREADY_EXISTS, 409);

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
