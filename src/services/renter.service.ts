import { ConstraintViolationError } from "objection";
import { EPagination, messageResponse } from "../enums";
import type { Filter, Renter } from "../interfaces";
import { Houses, Renters } from "../models";
import { ApiException, camelToSnake, filterHandler, jwtToken, sortingHandler } from "../utils";

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

    static async getHouseId(renterId: string) {
        const house = await Renters.query()
            .join("rooms", "renters.room_id", "rooms.id")
            .join("house_floors", "rooms.floor_id", "house_floors.id")
            .join("houses", "house_floors.house_id", "houses.id")
            .where("renters.id", renterId)
            .select("houses.id")
            .first();
        if (!house) {
            throw new ApiException(messageResponse.HOUSE_NOT_FOUND, 404);
        }
        return house.id;
    }

    static async getRoomId(renterId: string) {
        const room = await Renters.query().findById(renterId).select("room_id");
        if (!room) {
            throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);
        }
        return room.roomId;
    }

    static async getById(id: string) {
        // Get renter by id
        const renter = await Renters.query().findById(id);
        if (!renter) {
            throw new ApiException(messageResponse.RENTER_NOT_FOUND, 404);
        }
        return renter;
    }

    static async findOne(key: string) {
        // if key match phone number
        if (key.match(/^\+84\d{9,10}$/) || key.match(/^0\d{9,10}$/)) {
            const internationalPhoneNumber = key.startsWith("+84") ? key : key.replace(/^0/, "+84");
            const domesticPhoneNumber = key.startsWith("0") ? key : key.replace(/^\+84/, "0");
            const renter = await Renters.query()
                .where("phone_number", internationalPhoneNumber)
                .orWhere("phone_number", domesticPhoneNumber)
                .first();
            return renter;
        }

        // if key match email
        if (key.match(/.+@.+\..+/)) {
            const renter = await Renters.query().where("email", key).first();
            return renter;
        }

        // if key match id
        const renter = await Renters.query().findById(key);
        return renter;
    }

    static async getByEmail(email: string) {
        // Get renter by email
        const renter = await Renters.query().where("email", email).first();
        if (!renter) {
            throw new ApiException(messageResponse.RENTER_NOT_FOUND, 404);
        }
        return renter;
    }

    static async getByPhoneNumber(phoneNumber: string) {
        const internationalPhoneNumber = phoneNumber.startsWith("+84") ? phoneNumber : phoneNumber.replace(/^0/, "+84");
        const domesticPhoneNumber = phoneNumber.startsWith("0") ? phoneNumber : phoneNumber.replace(/^\+84/, "0");

        // Get renter by phone number
        const renter = await Renters.query()
            .where("phone_number", internationalPhoneNumber)
            .orWhere("phone_number", domesticPhoneNumber)
            .first();
        if (!renter) {
            throw new ApiException(messageResponse.RENTER_NOT_FOUND, 404);
        }
        return renter;
    }

    static async listByHouse(houseId: string, filterData?: Filter) {
        const {
            filter = [],
            sort = [],
            pagination = { page: EPagination.DEFAULT_PAGE, pageSize: EPagination.DEFAULT_LIMIT },
        } = filterData || {};

        let renters = Renters.query()
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
            );

        // Filter
        renters = filterHandler(renters, filter);

        // Sort
        renters = sortingHandler(renters, sort);

        const clone = renters.clone();
        const total = await clone.resultSize();

        if (total === 0) {
            throw new ApiException(messageResponse.NO_RENTERS_FOUND, 404);
        }

        const totalPages = Math.ceil(total / pagination.pageSize);

        if (pagination.page === -1 && pagination.pageSize === -1) await renters.page(0, total);
        else await renters.page(pagination.page - 1, pagination.pageSize);

        const fetchData = await renters;

        return {
            ...fetchData,
            total,
            page: pagination.page,
            pageCount: totalPages,
            pageSize: pagination.pageSize,
        };
    }

    static async listByRoom(roomId: string, filterData?: Filter) {
        const {
            filter = [],
            sort = [],
            pagination: { page = EPagination.DEFAULT_PAGE, pageSize = EPagination.DEFAULT_LIMIT } = {},
        } = filterData || {};

        let query = Renters.query().where("room_id", roomId);

        // Filter
        query = filterHandler(query, filter);

        // Sort
        query = sortingHandler(query, sort);

        const clone = query.clone();
        const total = await clone.resultSize();
        if (total === 0) {
            throw new ApiException(messageResponse.NO_RENTERS_FOUND, 404);
        }

        const totalPages = Math.ceil(total / pageSize);

        if (page === -1 && pageSize === -1) await query.page(0, total);
        else await query.page(page - 1, pageSize);

        const renters = await query;

        return {
            ...renters,
            total,
            page,
            pageCount: totalPages,
            pageSize,
        };
    }

    static async update(id: string, data: Renter) {
        const renter = await this.getById(id);
        const updatedRenter = await renter.$query().patchAndFetch(camelToSnake(data));
        return updatedRenter;
    }

    static async delete(id: string) {
        const renter = await this.getById(id);
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
            .select(
                "id",
                "room_id",
                "name",
                "citizen_id",
                "birthday",
                "gender",
                "email",
                "phone_number",
                "address",
                "temp_reg",
                "move_in_date",
                "represent"
            )
            .first();
        if (!renter) {
            throw new ApiException(messageResponse.RENTER_NOT_FOUND, 404);
        }

        // sign token
        const accessToken = await this.generateAccessToken(renter);

        const refreshToken = await this.generateRefreshToken(renter);

        return { ...renter, accessToken, refreshToken };
    }

    static async generateAccessToken(renter: { id: string; email: string; phoneNumber: string; roomId: string }) {
        const accessToken = jwtToken.signAccessToken({
            id: renter.id,
            email: renter.email,
            phoneNumber: renter.phoneNumber,
            roomId: renter.roomId,
            role: "renter",
        });
        return accessToken;
    }

    static async generateRefreshToken(renter: { id: string; name: string; roomId: string }) {
        const refreshToken = jwtToken.signRefreshToken({
            id: renter.id,
            name: renter.name,
            roomId: renter.roomId,
            role: "renter",
        });
        return refreshToken;
    }

    static async changeRepresent(renterId: string, roomId: string) {
        // Change representative
        const renter = await this.getById(renterId);
        const roomRenters = await Renters.query().where("room_id", roomId);

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
}

export default RenterService;
