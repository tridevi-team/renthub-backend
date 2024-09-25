import { Action } from "../enums";
import messageResponse from "../enums/message.enum";
import { HouseCreate, HouseUpdate } from "../interfaces";
import { HouseFloors, Houses, Rooms } from "../models";
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

    static async getHouseById(houseId: string) {
        const details = await Houses.query().findById(houseId);
        if (!details) throw new ApiException(messageResponse.HOUSE_NOT_FOUND, 404);

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
            return housePermissions.permissions.house.read || housePermissions.permissions.house.update || housePermissions.permissions.house.delete;
        }
        return housePermissions.permissions.house[action];
    }
}

export default HouseService;
