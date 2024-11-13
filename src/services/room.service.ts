import { ForeignKeyViolationError } from "objection";
import { EPagination, messageResponse } from "../enums";
import type { Filter, Room, RoomServiceInfo } from "../interfaces";
import { Renters, RoomImages, Rooms, RoomServices, Services } from "../models";
import { ApiException, camelToSnake, filterHandler, sortingHandler } from "../utils";

class RoomService {
    static async create(houseId: string, data: Room) {
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
            const newRoom = await Rooms.query().insertAndFetch(camelToSnake(data));
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
            .withGraphJoined("services.service")
            .withGraphJoined("images")
            .findById(id);
        if (!room) {
            throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);
        }
        return {
            id: room.id,
            name: room.name,
            maxRenters: room.maxRenters,
            roomArea: room.roomArea,
            price: room.price,
            description: room.description,
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
            services: room.services.map((service) => {
                return {
                    id: service.serviceId,
                    name: service.service.name,
                    quantity: service.quantity,
                    unitPrice: service.service.unitPrice,
                    type: service.service.type,
                    description: service.description,
                };
            }),
            images: room.images.map((image) => image.imageUrl),
            status: room.status,
            createdBy: room.createdBy,
            createdAt: room.createdAt,
            updatedBy: room.updatedBy,
            updatedAt: room.updatedAt,
        };
    }

    static async getRoomsByFloor(floorId: string, filterData?: Filter, isSelect: boolean = false) {
        const { filter = [], sort = [], pagination } = filterData || {};

        const page = pagination?.page || EPagination.DEFAULT_PAGE;
        const pageSize = pagination?.pageSize || EPagination.DEFAULT_LIMIT;

        // Get list of rooms by floor
        let query = Rooms.query().findOne("floor_id", floorId);

        if (isSelect) {
            query = query.select("id", "name").orderBy("name");
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

    static async updateRoom(id: string, data: Room) {
        try {
            const room = await Rooms.query().findById(id);
            if (!room) {
                throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);
            }
            const updatedRoom = await room.$query().patchAndFetch(camelToSnake(data));
            return updatedRoom;
        } catch (err) {
            if (err instanceof ForeignKeyViolationError) {
                throw new ApiException(messageResponse.FLOOR_NOT_FOUND, 404);
            }
            throw err;
        }
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

    static async addServiceToRoom(roomId: string, services: RoomServiceInfo[], userId: string) {
        const room = await this.getRoomById(roomId);

        // check if services exist
        const serviceIds = await Services.query().whereIn(
            "id",
            services.map((service) => service.serviceId)
        );

        if (serviceIds.length !== services.length) {
            throw new ApiException(messageResponse.SERVICE_NOT_FOUND, 404);
        }

        // delete existing services
        await RoomServices.query().delete().where("room_id", roomId);

        // add services to room
        for (const service of services) {
            await RoomServices.query().insert(
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

        return room;
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

    static async addImagesToRoom(roomId: string, images: string[], userId: string) {
        const room = await this.getRoomById(roomId);

        // remove existing images
        await RoomImages.query().delete().where("room_id", roomId);

        for (const image of images) {
            await RoomImages.query().insert(
                camelToSnake({
                    room_id: roomId,
                    imageUrl: image,
                    createdBy: userId,
                    updatedBy: userId,
                })
            );
        }

        return room;
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
