import { ContractStatus, EPagination, messageResponse, RoomStatus, ServiceTypes } from "@enums";
import type { Filter, Room, RoomServiceInfo } from "@interfaces";
import { Bills, Renters, RoomContracts, RoomImages, Rooms, RoomServices, Services } from "@models";
import { HouseService } from "@services";
import { ApiException, camelToSnake, filterHandler, snakeToCamel, sortingHandler } from "@utils";
import { ForeignKeyViolationError, TransactionOrKnex } from "objection";

class RoomService {
    static async getServicesInContract(roomId: string) {
        let latestContract = await RoomContracts.query()
            .where({ room_id: roomId })
            .orderBy("created_at", "desc")
            .first();
        latestContract = snakeToCamel(latestContract as RoomContracts) as RoomContracts;
        let latestBill = await Bills.query()
            .where("room_id", roomId)
            .withGraphJoined("details")
            .orderBy("created_at", "desc")
            .first();
        latestBill = snakeToCamel(latestBill as Bills) as Bills;

        const services: {
            id?: string;
            name: string;
            quantity: number;
            unitPrice: number;
            type: string;
            oldValue: number;
        }[] = [];

        if (latestContract && latestContract.services) {
            services.push({
                id: "",
                name: "Tiền phòng",
                quantity: 1,
                unitPrice: latestContract.room.price,
                type: ServiceTypes.ROOM,
                oldValue: 0,
            });

            latestContract.services.map((service) => {
                const serviceDetail = latestBill?.details.find((detail) => detail.serviceId === service.id);
                console.log("🚀 ~ RoomService ~ latestContract.services.map ~ serviceDetail:", serviceDetail);
                services.push({
                    id: service.id,
                    name: service.name,
                    quantity: service.quantity,
                    unitPrice: service.unitPrice,
                    type: service.type,
                    oldValue: serviceDetail?.newValue || 0,
                });
            });
        } else {
            const data = await RoomServices.query()
                .where({
                    room_id: roomId,
                })
                .modify("basic");
            const roomDetails = await RoomService.getRoomById(roomId);

            services.push({
                id: "",
                name: "Tiền phòng",
                quantity: 1,
                unitPrice: roomDetails.price,
                type: ServiceTypes.ROOM,
                oldValue: 0,
            });

            data.map((service) => {
                services.push({
                    id: service.serviceId || service.id,
                    name: service.name,
                    quantity: service.quantity,
                    unitPrice: service.unitPrice,
                    type: service.type,
                    oldValue: 0,
                });
            });
        }

        console.log("🚀 ~ RoomService ~ getServicesInContract ~ services:", services);
        return services;
    }

    static async create(houseId: string, data: Room, trx?: TransactionOrKnex) {
        try {
            // check if room exists
            const room = await Rooms.query().join("house_floors", "rooms.floor_id", "house_floors.id").findOne({
                "rooms.name": data.name,
                "house_floors.house_id": houseId,
            });

            if (room) {
                throw new ApiException(messageResponse.ROOM_ALREADY_EXISTS, 409);
            }

            // create room
            const newRoom = await Rooms.query(trx).insertGraphAndFetch(
                {
                    "#id": "room",
                    floor_id: data.floorId,
                    name: data.name,
                    max_renters: data.maxRenters,
                    room_area: data.roomArea,
                    price: data.price,
                    description: data.description,
                    status: data.status || RoomStatus.AVAILABLE,
                    created_by: data.createdBy,
                    updated_by: data.updatedBy,
                    services: data.services?.map((service) => ({
                        room_id: "room",
                        service_id: service.serviceId,
                        quantity: service.quantity,
                        start_index: service.startIndex,
                        created_by: data.createdBy,
                        updated_by: data.updatedBy,
                    })),
                    images: data.images?.map((image) => ({
                        room_id: "room",
                        image_url: image,
                        created_by: data.createdBy,
                    })),
                },
                {
                    allowRefs: true,
                }
            );
            return newRoom;
        } catch (err) {
            if (err instanceof ForeignKeyViolationError) {
                throw new ApiException(messageResponse.FLOOR_NOT_FOUND, 404);
            }
            throw err;
        }
    }

    static async getHouseId(roomId: string) {
        const house = await Rooms.query()
            .join("house_floors", "rooms.floor_id", "house_floors.id")
            .findOne({
                "rooms.id": roomId,
            })
            .select("house_floors.house_id");

        if (!house) {
            throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);
        }

        return house.houseId;
    }

    static async getRoomById(id: string) {
        // Get room by id
        const room = await Rooms.query()
            .withGraphFetched("floor.house")
            .withGraphJoined("services(basic)")
            .withGraphJoined("equipment(details)")
            .withGraphJoined("images(imgArray) as images")
            .modify("roomInfo")
            .modifiers({
                imgArray(builder) {
                    builder.select("image_url");
                },
            })
            .findById(id);

        if (!room) {
            throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);
        }

        const houseId = room.floor.house.id;
        const contact = await HouseService.getContactInfo(houseId);
        const formattedRoom = {
            ...room,
            contact,
            house: {
                id: room.floor.house.id,
                name: room.floor.house.name,
                description: room.floor.house.description,
                floor: {
                    id: room.floor.id,
                    name: room.floor.name,
                    description: room.floor.description,
                },
            },
            images: room.images.map((image) => image.imageUrl),
        };

        if (formattedRoom.floor) {
            delete (formattedRoom as any).floor;
        }
        return formattedRoom;
    }

    static async getRoomsByFloor(floorId: string, filterData?: Filter, isSelect: boolean = false) {
        const { filter = [], sort = [], pagination } = filterData || {};

        const page = pagination?.page || EPagination.DEFAULT_PAGE;
        const pageSize = pagination?.pageSize || EPagination.DEFAULT_LIMIT;

        // Get list of rooms by floor
        let query = Rooms.query().where("floor_id", floorId);

        if (isSelect) {
            query = query.select("id", "name").orderBy("name");
            const rooms = await query;
            return rooms;
        }
        query = query.leftJoinRelated("images(thumbnail)").modify("basic");

        // filter
        query = filterHandler(query, filter);

        // sort
        query = sortingHandler(query, sort);

        const clone = query.clone();
        const total = await clone.resultSize();
        const totalPages = Math.ceil(total / pageSize);

        if (total === 0) {
            throw new ApiException(messageResponse.NO_ROOMS_FOUND, 404);
        }

        if (page !== -1 && pageSize !== -1) {
            query.page(page - 1, pageSize);
        } else {
            query.page(0, total);
        }

        const rooms = await query;

        return {
            ...rooms,
            page,
            pageCount: totalPages,
            total,
            pageSize,
        };
    }

    static async getRoomServices(roomId: string) {
        const services = await RoomServices.query()
            .joinRelated("service")
            .where("room_id", roomId)
            .select("service_id as id", "name", "unit_price", "type", "quantity");
        if (services.length === 0) {
            throw new ApiException(messageResponse.NO_SERVICES_FOUND, 404);
        }
        return services;
    }

    static async countRenterInRoom(roomId: string) {
        const renters = await Renters.query().where("room_id", roomId).count("id", {
            as: "count",
        });
        return renters[0].count;
    }

    static async getRoomServiceDetails(roomId: string, serviceId: string) {
        const service = await RoomServices.query()
            .joinRelated("service")
            .where("room_id", roomId)
            .andWhere("service_id", serviceId)
            .select("services.id as id", "name", "unit_price", "type", "quantity")
            .first();
        if (!service) {
            throw new ApiException(messageResponse.SERVICE_NOT_FOUND, 404);
        }
        return service;
    }

    // static async listByHouse(houseId: string, pagination: Pagination = { page: 1, pageSize: 10 }) {
    //     // Get list of rooms by house
    //     const rooms = await Rooms.query()
    //         .withGraphFetched("floor.house")
    //         .where("floor.house_id", houseId)
    //         .withGraphJoined("services.service")
    //         .withGraphJoined("images")
    //         .page(pagination.page - 1, pagination.pageSize);
    //     if (rooms.results.length === 0) {
    //         throw new ApiException(messageResponse.NO_ROOMS_FOUND, 404);
    //     }
    //     return {
    //         results: rooms.results.map((room) => {
    //             return {
    //                 id: room.id,
    //                 name: room.name,
    //                 maxRenters: room.maxRenters,
    //                 roomArea: room.roomArea,
    //                 price: room.price,
    //                 description: room.description,
    //                 house: {
    //                     id: room.floor.house.id,
    //                     name: room.floor.house.name,
    //                     description: room.floor.house.description,
    //                     floor: {
    //                         id: room.floor.id,
    //                         name: room.floor.name,
    //                         description: room.floor.description,
    //                     },
    //                 },
    //                 services: room.services.map((service) => {
    //                     return {
    //                         id: service.serviceId,
    //                         name: service.service.name,
    //                         quantity: service.quantity,
    //                         unitPrice: service.service.unitPrice,
    //                         type: service.service.type,
    //                         description: service.description,
    //                     };
    //                 }),
    //                 images: room.images.map((image) => image.imageUrl),
    //                 status: room.status,
    //                 createdBy: room.createdBy,
    //                 createdAt: room.createdAt,
    //                 updatedBy: room.updatedBy,
    //                 updatedAt: room.updatedAt,
    //             };
    //         }),
    //         total: rooms.total,
    //     };
    // }

    static async updateRoom(id: string, data: Room, trx?: TransactionOrKnex) {
        try {
            const room = await Rooms.query().findById(id);
            if (!room) {
                throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);
            }
            const updatedRoom = await room.$query(trx).patchAndFetch(camelToSnake(data));
            return updatedRoom;
        } catch (err) {
            if (err instanceof ForeignKeyViolationError) {
                throw new ApiException(messageResponse.FLOOR_NOT_FOUND, 404);
            }
            throw err;
        }
    }

    static async updateStatusByContract(
        roomId: string,
        status: ContractStatus,
        updatedBy: string,
        trx?: TransactionOrKnex
    ) {
        const room = await Rooms.query().findById(roomId);
        if (!room) {
            throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);
        }
        if ([ContractStatus.ACTIVE].includes(status)) {
            await room.$query(trx).patch(camelToSnake({ status: RoomStatus.RENTED, updatedBy }));
        } else if ([ContractStatus.CANCELLED, ContractStatus.TERMINATED].includes(status)) {
            await room.$query(trx).patch(camelToSnake({ status: RoomStatus.AVAILABLE, updatedBy }));
        } else if (status === ContractStatus.EXPIRED) {
            // check latest contract of room, if it is expired, set room status to available
            const latestContract = await RoomContracts.query()
                .where("room_id", roomId)
                .orderBy("created_at", "desc")
                .first();

            if (latestContract?.status === ContractStatus.EXPIRED) {
                await room.$query(trx).patch(camelToSnake({ status: RoomStatus.AVAILABLE, updatedBy }));
            }
        } else if ([ContractStatus.PENDING].includes(status)) {
            await room.$query(trx).patch(camelToSnake({ status: RoomStatus.PENDING, updatedBy }));
        }
    }

    static async updateRoomStatus(id: string, status: RoomStatus, updatedBy: string) {
        const room = await Rooms.query().findById(id);
        if (!room) {
            throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);
        }
        const updatedRoom = await room.$query().patchAndFetch(camelToSnake({ status, updatedBy }));
        return updatedRoom;
    }

    static async deleteRoom(id: string, deletedBy: string) {
        const room = await Rooms.query().findById(id);
        if (!room) {
            throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);
        }
        await room.$query().patch(camelToSnake({ updatedBy: deletedBy }));
        const deletedRoom = await room.$query().delete();
        return deletedRoom;
    }

    static async roomIdsByHouse(houseId: string) {
        const rooms = await Rooms.query()
            .select("rooms.id")
            .join("house_floors as floor", "rooms.floor_id", "floor.id")
            .where("floor.house_id", houseId);

        if (rooms.length === 0) {
            throw new ApiException(messageResponse.NO_ROOMS_FOUND, 404);
        }
        return rooms.map((room) => room.id as string);
    }

    static async deleteRoomsByHouse(ids: string[], deletedBy: string) {
        const rooms = await Rooms.query().findByIds(ids);
        if (rooms.length === 0) {
            throw new ApiException(messageResponse.NO_ROOMS_FOUND, 404);
        }

        await Rooms.query().findByIds(ids).patch({
            updatedBy: deletedBy,
        });

        await Rooms.query().delete().findByIds(ids);
    }

    static async addServiceToRoom(
        roomId: string,
        services: RoomServiceInfo[],
        userId: string,
        trx?: TransactionOrKnex
    ) {
        // const room = await Rooms.query(trx).findById(roomId);

        // check if services exist
        const serviceIds = await Services.query().whereIn(
            "id",
            services.map((service) => service.serviceId)
        );

        if (serviceIds.length !== services.length) {
            throw new ApiException(messageResponse.SERVICE_NOT_FOUND, 404);
        }

        // delete existing services
        await RoomServices.query(trx).delete().where("room_id", roomId);

        // add services to room
        for (const service of services) {
            await RoomServices.query(trx).insert(
                camelToSnake({
                    roomId,
                    serviceId: service.serviceId,
                    quantity: service.quantity,
                    startIndex: service.startIndex,
                    createdBy: userId,
                    updatedBy: userId,
                })
            );
        }

        // return room;
    }

    static async updateServicesInRoom(
        roomId: string,
        services: RoomServiceInfo[],
        updatedBy: string,
        trx?: TransactionOrKnex
    ) {
        for (const service of services) {
            await RoomServices.query(trx)
                .findOne({
                    room_id: roomId,
                    service_id: service.serviceId,
                })
                .patch({ ...service, updated_by: updatedBy });
        }
    }

    static async removeServicesFromRoom(roomId: string, services: RoomServiceInfo[], userId: string) {
        const room = await this.getRoomById(roomId);

        // check if services exist
        const serviceIds = await Services.query().whereIn(
            "id",
            services.map((service) => service.serviceId)
        );
        if (serviceIds.length !== services.length) {
            throw new ApiException(messageResponse.SERVICE_NOT_FOUND, 404);
        }

        // remove services from room
        for (const service of services) {
            await RoomServices.query()
                .patch(camelToSnake({ updatedBy: userId }))
                .where("room_id", roomId)
                .andWhere("service_id", service.serviceId);
            await RoomServices.query().delete().where("room_id", roomId).andWhere("service_id", service.serviceId);
        }

        return room;
    }

    static async addImagesToRoom(roomId: string, images: string[], userId: string, trx?: TransactionOrKnex) {
        // const room = await Rooms.query(trx).findById(roomId);

        // remove existing images
        await RoomImages.query(trx).delete().where("room_id", roomId);

        for (const image of images) {
            await RoomImages.query(trx).insert(
                camelToSnake({
                    room_id: roomId,
                    imageUrl: image,
                    createdBy: userId,
                    // updatedBy: userId,
                })
            );
        }

        // return room;
    }

    static async removeImagesFromRoom(roomId: string, images: string[]) {
        const room = await Rooms.query().findById(roomId);
        if (!room) throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);

        // remove images from room
        await room.$relatedQuery("images").unrelate().whereIn("id", images);

        return room;
    }
}

export default RoomService;
