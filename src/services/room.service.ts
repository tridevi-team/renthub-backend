import { ForeignKeyViolationError } from "objection";
import messageResponse from "../enums/message.enum";
import type { Pagination, Room, RoomServiceInfo } from "../interfaces";
import { Roles, RoomImages, Rooms, RoomServices, Services } from "../models";
import { ApiException } from "../utils";
import camelToSnake from "../utils/camelToSnake";

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

    static async listByHouse(houseId: string, pagination: Pagination = { page: 1, limit: 10 }) {
        // Get list of rooms by house
        const rooms = await Rooms.query()
            .withGraphFetched("floor.house")
            .where("floor.house_id", houseId)
            .withGraphJoined("services.service")
            .withGraphJoined("images")
            .page(pagination.page - 1, pagination.limit);
        if (rooms.results.length === 0) {
            throw new ApiException(messageResponse.NO_ROOMS_FOUND, 404);
        }
        return {
            results: rooms.results.map((room) => {
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
            }),
            total: rooms.total,
        };
    }

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

    static async isRoomAccessible(userId: string, roomId: string, action: string) {
        const room = await Rooms.query().findById(roomId);

        if (!room) throw new ApiException(messageResponse.ROLE_NOT_FOUND, 404);
        // get houseId
        const houseDetails = await Rooms.query()
            .join("house_floors", "rooms.floor_id", "house_floors.id")
            .join("houses", "house_floors.house_id", "houses.id")
            .where("rooms.id", roomId)
            .select("houses.created_by", "houses.id")
            .first();
        if (!houseDetails) throw new ApiException(messageResponse.HOUSE_NOT_FOUND, 404);

        if (houseDetails.createdBy === userId) return true;

        // get house permissions
        const housePermissions = await Roles.query()
            .leftJoin("user_roles", "roles.id", "user_roles.role_id")
            .findOne(
                camelToSnake({
                    "roles.houseId": houseDetails.id,
                    "userRoles.userId": userId,
                })
            );

        if (!housePermissions?.permissions) return false;
        else if (action === "read") {
            return (
                housePermissions.permissions.role.read ||
                housePermissions.permissions.role.update ||
                housePermissions.permissions.role.delete
            );
        } else if (action === "update") {
            return housePermissions.permissions.role.update;
        } else if (action === "delete") {
            return housePermissions.permissions.role.delete;
        }

        return false;
    }
}

export default RoomService;
