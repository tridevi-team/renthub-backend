import messageResponse from "../enums/message.enum";
import { Pagination, Renter } from "../interfaces";
import { Renters } from "../models";
import { ApiException } from "../utils";
import camelToSnake from "../utils/camelToSnake";

class RenterService {
    static async create(data: Renter) {
        // check if renter exists
        const renter = await Renters.query().findOne({
            name: data.name,
            citizen_id: data.citizenId,
        });
        if (renter) {
            throw new ApiException(messageResponse.RENTER_ALREADY_EXISTS, 409);
        }

        // create renter
        const newRenter = await Renters.query().insert(camelToSnake(data));
        return newRenter;
    }

    static async get(id: string) {
        // Get renter by id
        const renter = await Renters.query().findById(id);
        if (!renter) {
            throw new ApiException(messageResponse.RENTER_NOT_FOUND, 404);
        }
        return renter;
    }

    static async listByHouse(houseId: string, pagination: Pagination) {
        // Get list of renters by house
        const renters = await Renters.query().join("rooms", "renters.room_id", "rooms.id").join("houses", "rooms.house_id", "houses.id").where("houses.id", houseId).select("renters.*").page(pagination.page - 1, pagination.limit);
        if (renters.results.length === 0) {
            throw new ApiException(messageResponse.NO_RENTERS_FOUND, 404);
        }
        return renters;
    }

    static async listByRoom(roomId: string) {
        // Get list of renters by room
        const renters = await Renters.query().where("room_id", roomId);
        if (renters.length === 0) {
            throw new ApiException(messageResponse.NO_RENTERS_FOUND, 404);
        }
        return renters;
    }

    static async update(id: string, data: Renter) {
        const renter = await this.get(id);
        const updatedRenter = await Renters.query().patchAndFetchById(id, camelToSnake(data));
        return updatedRenter;
    }

    static async delete(id: string) {
        const renter = await this.get(id);
        const deletedRenter = await Renters.query().deleteById(id);
        return deletedRenter;
    }

    static async login(data: { email?: string; phoneNumber?: string }) {
        if (data.email) {
            const renter = await Renters.query().findOne({ email: data.email });
            if (!renter) {
                throw new ApiException(messageResponse.INVALID_USER, 401);
            }
            return renter;
        } else if (data.phoneNumber) {
            const renter = await Renters.query().findOne({ phone_number: data.phoneNumber });
            if (!renter) {
                throw new ApiException(messageResponse.INVALID_USER, 401);
            }
            return renter;
        }
        return null;
    }
}

export default RenterService;
