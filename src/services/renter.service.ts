import { ConstraintViolationError } from "objection";
import type { Pagination, Renter } from "../interfaces";
import { Houses, Renters, Roles } from "../models";
import { ApiException, camelToSnake, jwtToken } from "../utils";
import { messageResponse } from "../enums";

class RenterService {
    static async create(data: Renter) {
        try {
            // check if renter exists
            const renter = await Renters.query()
                .where("email", "=", data.email || "")
                .orWhere("email", "=", data.email || "")
                .orWhere("phone_number", "=", data.phoneNumber || "")
                .first();
            if (renter) {
                throw new ApiException(messageResponse.RENTER_ALREADY_EXISTS, 409);
            }

            // create renter
            const newRenter = await Renters.query().insert(camelToSnake(data));
            return newRenter;
        } catch (err) {
            if (err instanceof ConstraintViolationError) {
                throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);
            }
            throw err;
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
        const renters = await Renters.query()
            .join("rooms", "renters.room_id", "rooms.id")
            .join("house_floors", "rooms.floor_id", "house_floors.id")
            .join("houses", "house_floors.house_id", "houses.id")
            .where("houses.id", houseId)
            .select(
                "house_floors.id as floor_id",
                "house_floors.name as floor_name",
                "rooms.id as room_id",
                "rooms.name as room_name",
                "renters.id as renter_id",
                "renters.name as renter_name",
                "renters.citizen_id",
                "renters.birthday",
                "renters.gender",
                "renters.email",
                "renters.phone_number",
                "renters.address",
                "renters.temp_reg",
                "renters.represent",
                "renters.move_in_date",
                "renters.note"
            )
            .page(pagination.page - 1, pagination.pageSize);

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
        const updatedRenter = await renter.$query().patchAndFetch(camelToSnake(data));
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
        const renter = await Renters.query()
            .where((builder) => {
                if (data.email) {
                    builder.where("email", data.email);
                }
                if (data.phoneNumber) {
                    builder.orWhere("phone_number", data.phoneNumber);
                }
            })
            .first();
        if (!renter) {
            throw new ApiException(messageResponse.RENTER_NOT_FOUND, 404);
        }
        return renter;
    }

    static async login(data: { email?: string; phoneNumber?: string }) {
        const renter = await Renters.query()
            .where((builder) => {
                if (data.email) {
                    builder.where("email", data.email);
                }
                if (data.phoneNumber) {
                    builder.orWhere("phone_number", data.phoneNumber);
                }
            })
            .first();
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
            await Renters.query().patchAndFetchById(representRenter.id, {
                represent: false,
            });
        }
        const updatedRenter = await renter.$query().patchAndFetch({ represent: true });
        return updatedRenter;
    }

    static async isOwner(renterId: string, roomId: string) {
        // Check if renter is owner of room
        const renter = await Renters.query().findById(renterId);
        if (renter && renter.roomId === roomId) {
            return true;
        }
        return false;
    }

    static async accessHouse(renterId: string, houseId: string) {
        // Check if renter has access to house
        const room = await Houses.query()
            .join("rooms", "houses.id", "rooms.house_id")
            .join("renters", "rooms.id", "renters.room_id")
            .where("renters.id", renterId)
            .andWhere("houses.id", houseId)
            .first();
        if (room) {
            return true;
        }

        return false;
    }

    static async isRenterAccessible(userId: string, renterId: string, action: string) {
        const renter = await Renters.query().findById(renterId);
        if (!renter) {
            throw new ApiException(messageResponse.RENTER_NOT_FOUND, 404);
        }

        const houseDetails = await Renters.query()
            .join("rooms", "renters.room_id", "rooms.id")
            .join("house_floors", "rooms.floor_id", "house_floors.id")
            .join("houses", "house_floors.house_id", "houses.id")
            .where("renters.id", renterId)
            .select("houses.created_by", "houses.id")
            .first();
        if (houseDetails && houseDetails.createdBy === userId) return true;

        const housePermissions = await Roles.query()
            .leftJoin("user_roles", "roles.id", "user_roles.role_id")
            .findOne(
                camelToSnake({
                    "roles.house_id": houseDetails?.id,
                    "user_roles.user_id": userId,
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

export default RenterService;
