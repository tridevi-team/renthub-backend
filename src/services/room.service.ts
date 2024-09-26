import messageResponse from "../enums/message.enum";
import { Pagination, Room, RoomServiceInfo } from "../interfaces";
import { RoomImages, Rooms, RoomServices, Services } from "../models";
import { ApiException } from "../utils";
import camelToSnake from "../utils/camelToSnake";

class RoomService {
    static async create(houseId: string, data: Room) {
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
    }

    static async getRoomById(id: string) {
        // Get room by id
        const room = await Rooms.query().withGraphJoined("services.service").withGraphJoined("images").findById(id);
        if (!room) {
            throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);
        }
        return room;
    }

    static async listByHouse(houseId: string, pagination: Pagination = null) {
        // Get list of rooms by house
        const rooms = await Rooms.query()
            .where("house_id", houseId)
            .page(pagination.page - 1, pagination.limit);
        if (rooms.results.length === 0) {
            throw new ApiException(messageResponse.NO_ROOMS_FOUND, 404);
        }
        return rooms;
    }

    static async updateRoom(id: string, data: Room) {
        const room = await this.getRoomById(id);
        const updatedRoom = await room.$query().patchAndFetch(camelToSnake(data));
        return updatedRoom;
    }

    static async deleteRoom(id: string, deletedBy: string) {
        const room = await this.getRoomById(id);
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
            await RoomServices.query().insert(camelToSnake({ roomId, serviceId: service.serviceId, quantity: service.quantity, startIndex: service.startIndex, createdBy: userId, updatedBy: userId }));
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
            await RoomImages.query().insert(camelToSnake({ room_id: roomId, imageUrl: image, createdBy: userId, updatedBy: userId }));
        }

        return room;
    }

    static async removeImagesFromRoom(roomId: string, images: string[]) {
        const room = await this.getRoomById(roomId);

        // remove images from room
        await room.$relatedQuery("images").unrelate().whereIn("id", images);

        return room;
    }
}

export default RoomService;
