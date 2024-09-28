import { ConstraintViolationError } from "objection";
import messageResponse from "../enums/message.enum";
import { Pagination, Renter } from "../interfaces";
import { Renters } from "../models";
import { ApiException, jwtToken } from "../utils";
import camelToSnake from "../utils/camelToSnake";

class RenterService {
    static async create(data: Renter) {
        try {
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
        } catch (err) {
            if (err instanceof ConstraintViolationError) {
                throw new ApiException(messageResponse.RENTER_ALREADY_EXISTS, 409);
            }
        }
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
        const renters = await Renters.query()
            .join("rooms", "renters.room_id", "rooms.id")
            .join("houses", "rooms.house_id", "houses.id")
            .where("houses.id", houseId)
            .select("renters.*")
            .page(pagination.page - 1, pagination.limit);
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
        if (renter.represent) {
            throw new ApiException(messageResponse.CHANGE_REPRESENT_BEFORE_DELETE, 409);
        }
        const deletedRenter = await Renters.query().deleteById(id);
        return deletedRenter;
    }

    static async checkExists(data: { email?: string; phoneNumber?: string }) {
        const renter = await Renters.query().where("email", data.email).orWhere("phone_number", data.phoneNumber).first();
        return renter;
    }

    static async login(data: { email?: string; phoneNumber?: string }) {
        const renter = await Renters.query().where("email", data.email).orWhere("phone_number", data.phoneNumber).first();
        if (!renter) {
            throw new ApiException(messageResponse.RENTER_NOT_FOUND, 404);
        }

        // sign token
        const accessToken = await jwtToken.signAccessToken({
            id: renter.id,
            email: renter.email,
            phoneNumber: renter.phoneNumber,
            room_id: renter.roomId,
            type: "renter",
        });

        const refreshToken = await jwtToken.signRefreshToken({
            id: renter.id,
            name: renter.name,
            room_id: renter.roomId,
            type: "renter",
        });

        return { ...renter, accessToken, refreshToken };
    }

    static async changeRepresent(renterId: string, roomId: string) {
        // Change representative
        const renter = await this.get(renterId);
        const roomRenters = await this.listByRoom(roomId);
        const representRenter = roomRenters.find((r) => r.represent);
        if (representRenter) {
            await Renters.query().patchAndFetchById(representRenter.id, { represent: false });
        }
        const updatedRenter = await Renters.query().patchAndFetchById(renterId, { represent: true });
        return updatedRenter;
    }
}

export default RenterService;
