import { ApprovalStatus, ContractStatus, messageResponse } from "@enums";
import {
    ContractRequest,
    ContractUpdateRequest,
    Filter,
    RoomContractRequest,
    RoomContractUpdateRequest,
} from "@interfaces";
import { ContractKeyReplace, ContractTemplate, RoomContracts, Rooms } from "@models";
import { HouseService, RoomService } from "@services";
import { ApiException, camelToSnake, currentDateTime, filterHandler, sortingHandler } from "@utils";
import { TransactionOrKnex } from "objection";
import { default as VNnum2words } from "vn-num2words";

class ContractService {
    static async getKeys() {
        const keys = await ContractKeyReplace.query();
        return keys;
    }

    static async isValidContract(roomId: string, contractId: string) {
        const houseId = await RoomService.getHouseId(roomId);
        const contract = await ContractTemplate.query().findOne({
            id: contractId,
            houseId,
        });

        return !!contract;
    }

    static async isNameExists(houseId: string, name: string, contractId?: string) {
        console.log(houseId, name, contractId);

        // check name is exists
        let isExists = ContractTemplate.query().findOne(camelToSnake({ houseId, name }));

        if (contractId) isExists = isExists.whereNot(camelToSnake({ id: contractId }));

        return !!(await isExists);
    }

    static async createContractTemplate(contract: ContractRequest) {
        // check name is exists
        const isNameExists = await this.isNameExists(contract.houseId, contract.name);

        if (isNameExists) {
            throw new ApiException(messageResponse.TEMPLATE_ALREADY_EXISTS, 409);
        }
        // create contract template
        const newContract = await ContractTemplate.query().insert(camelToSnake(contract));

        return newContract;
    }

    static async createRoomContract(contract: RoomContractRequest, trx?: TransactionOrKnex) {
        const isValidContract = await this.isValidContract(contract.roomId, contract.contractId);
        if (!isValidContract) {
            throw new ApiException(messageResponse.CONTRACT_NOT_FOUND, 404);
        }

        // check contract is exists in range date
        const isExists = await RoomContracts.query()
            .where(camelToSnake({ roomId: contract.roomId }))
            .whereBetween("rental_start_date", [contract.rentalStartDate, contract.rentalEndDate])
            .orWhereBetween("rental_end_date", [contract.rentalStartDate, contract.rentalEndDate])
            .whereIn("status", [ContractStatus.ACTIVE, ContractStatus.PENDING]);

        const templateDetails = await this.findOneContractTemplate(contract.contractId);

        if (!templateDetails) {
            throw new ApiException(messageResponse.CONTRACT_NOT_FOUND, 404);
        }

        if (isExists.length) {
            throw new ApiException(messageResponse.CONTRACT_ALREADY_EXISTS, 409);
        }

        // create room contract
        const newContract = await RoomContracts.query(trx).insert(
            camelToSnake({ ...contract, content: templateDetails.content })
        );

        // update room status
        await RoomService.updateStatusByContract(newContract.room.id, newContract.status, newContract.createdBy, trx);

        return newContract;
    }

    static async addRenterAccess(roomId: string, renterId: string) {
        // add to latest contract of room
        const room = await RoomContracts.query().findOne({ roomId }).orderBy("created_at", "desc");

        if (!room) {
            throw new ApiException(messageResponse.CONTRACT_NOT_FOUND, 404);
        }

        const renterIds = room.renterIds + "," + renterId;

        await room.$query().patch({ renterIds });

        return await this.findOneRoomContract(room.id);
    }

    static async findOneContractTemplate(id: string) {
        const contract = await ContractTemplate.query().findById(id);
        if (!contract) {
            throw new ApiException(messageResponse.GET_TEMPLATE_DETAILS_FAIL, 404);
        }

        return contract;
    }

    static async findAllContractTemplate(houseId: string, filterData: Filter) {
        const {
            filter = [],
            sort = [],
            pagination: { page, pageSize },
        } = filterData || {};

        let list = ContractTemplate.query().where(camelToSnake({ houseId }));

        // filter
        list = filterHandler(list, filter);

        // sort
        list = sortingHandler(list, sort);

        const clone = list.clone();
        const total = await clone.resultSize();
        const totalPages = Math.ceil(total / pageSize);

        // Pagination
        if (page !== -1 && pageSize !== -1) await list.page(page - 1, pageSize);
        else await list.page(0, total);

        const fetchData = await list;

        return { ...fetchData, page, pageCount: totalPages, pageSize, total };
    }

    static async findOneRoomContract(id: string) {
        const contract = await RoomContracts.query().findById(id);
        if (!contract) {
            throw new ApiException(messageResponse.CONTRACT_NOT_FOUND, 404);
        }

        return contract;
    }

    static async findKeyData(contractId: string) {
        const keyData = {};
        const room = await Rooms.query()
            .join("room_contracts", "rooms.id", "room_contracts.room_id")
            .where("room_contracts.id", contractId)
            .select("rooms.*")
            .first();

        const contract = await RoomContracts.query().findById(contractId);
        if (!contract) {
            throw new ApiException(messageResponse.CONTRACT_NOT_FOUND, 404);
        }

        if (!room) {
            throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);
        }

        const houseConfigs = await HouseService.getHouseSettings(room.id);

        // {{COLLECTION_CYCLE}}
        keyData["COLLECTION_CYCLE"] = houseConfigs.invoiceDate;

        //{{CONTRACT_START_DATE}}
        keyData["CONTRACT_START_DATE"] = contract?.rentalStartDate;

        // {{CONTRACT_END_DATE}}
        keyData["CONTRACT_END_DATE"] = contract?.rentalEndDate;

        // {{CONTRACT_MONTHS}}
        // calculate months based on start date and end date
        const startDate = new Date(contract?.rentalStartDate);
        const endDate = new Date(contract?.rentalEndDate);
        const months =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
        keyData["CONTRACT_MONTHS"] = months;

        // {{CURRENT_DATE}}
        keyData["CURRENT_DATE"] = currentDateTime();

        // {{DEPOSIT_AMOUNT}}
        keyData["DEPOSIT_AMOUNT"] = contract?.depositAmount;

        // {{DEPOSIT_AMOUNT_IN_WORDS}}
        keyData["DEPOSIT_AMOUNT_IN_WORDS"] = VNnum2words(contract?.depositAmount);

        // {{FEE_COLLECTION_DAY}}
        keyData["FEE_COLLECTION_DAY"] = houseConfigs.invoiceDate;

        // {{HOST_NAME}}
        keyData["HOST_NAME"] = contract.landlord?.fullName || "Unknown";

        // {{HOUSE_NAME}}
        keyData["HOUSE_NAME"] = houseConfigs.houseName || "Unknown";

        // {{OWNER_ADDRESS}}
        keyData["OWNER_ADDRESS"] =
            (contract.landlord?.address.street || null) +
                ", " +
                (contract.landlord?.address.ward || null) +
                ", " +
                (contract.landlord?.address.district || null) +
                ", " +
                (contract.landlord?.address.city || null) || "Unknown";

        // {{OWNER_BANK_ACCOUNT_NUMBER}}

        // {{OWNER_BANK_FULL_NAME}}

        // {{OWNER_BIRTHDAY}}
        keyData["OWNER_BIRTHDAY"] = contract.landlord?.birthday;

        // {{OWNER_DATE_OF_ISSUANCE}}
        keyData["OWNER_DATE_OF_ISSUANCE"] = contract.landlord?.dateOfIssue;

        // {{OWNER_IDENTITY_NUMBER}}
        keyData["OWNER_IDENTITY_NUMBER"] = contract.landlord?.citizenId;

        // {{OWNER_PHONE}}
        keyData["OWNER_PHONE"] = contract.landlord?.phoneNumber;

        // {{OWNER_PLACE_OF_ISSUE}}
        keyData["OWNER_PLACE_OF_ISSUE"] = contract.landlord?.placeOfIssue;

        // {{RENTAL_HOUSE_ADDRESS}}
        keyData["RENTAL_HOUSE_ADDRESS"] =
            (houseConfigs?.houseAddress.street || null) +
                ", " +
                (houseConfigs?.houseAddress.ward || null) +
                ", " +
                (houseConfigs?.houseAddress.district || null) +
                ", " +
                (houseConfigs?.houseAddress.city || null) || "Unknown";

        // {{RENTER_ADDRESS}}
        keyData["RENTAL_HOUSE_ADDRESS"] =
            (contract.renter?.address.street || null) +
                ", " +
                (contract.renter?.address.ward || null) +
                ", " +
                (contract.renter?.address.district || null) +
                ", " +
                (contract.renter?.address.city || null) || "Unknown";

        // {{RENTER_BIRTHDAY}}
        keyData["RENTER_BIRTHDAY"] = contract.renter?.birthday;

        // {{RENTER_DATE_OF_ISSUANCE}}
        keyData["RENTER_DATE_OF_ISSUANCE"] = contract.renter?.dateOfIssue;

        // {{RENTER_IDENTITY_NUMBER}}
        keyData["RENTER_IDENTITY_NUMBER"] = contract.renter?.citizenId;

        // {{RENTER_NAME}}
        keyData["RENTER_NAME"] = contract.renter?.fullName;

        // {{RENTER_PHONE_NUMBER}}
        keyData["RENTER_PHONE_NUMBER"] = contract.renter?.phoneNumber;

        // {{RENTER_PLACE_OF_ISSUE}}
        keyData["RENTER_PLACE_OF_ISSUE"] = contract.renter?.placeOfIssue;

        // {{RENT_COST}}
        keyData["RENT_COST"] = contract.room?.price;

        // {{RENTAL_AMOUNT_IN_WORDS}}
        keyData["RENTAL_AMOUNT_IN_WORDS"] = VNnum2words(contract.room?.price || 0);

        // {{ROOM_NAME}}
        keyData["ROOM_NAME"] = contract.room?.name;

        // {{ROOM_VEHICLE_LIST}}

        // {{SQUARE_METER}}
        keyData["SQUARE_METER"] = contract.room?.roomArea;

        // {{USE_SERVICES}}
        keyData["USE_SERVICES"] = contract.services;

        return keyData;
    }

    static async findAllRoomContract(roomId: string, filterData: Filter) {
        const {
            filter = [],
            sort = [],
            pagination: { page, pageSize },
        } = filterData || {};

        let list = RoomContracts.query().where(camelToSnake({ roomId }));

        // filter
        list = filterHandler(list, filter);

        // sort
        list = sortingHandler(list, sort);

        const clone = list.clone();
        const total = await clone.resultSize();
        const totalPages = Math.ceil(total / pageSize);

        // Pagination
        if (page !== -1 && pageSize !== -1) await list.page(page - 1, pageSize);
        else await list.page(0, total);

        const fetchData = await list;

        return { ...fetchData, page, pageCount: totalPages, pageSize, total };
    }

    static async findAllRoomContractByRenter(renterId: string, filterData: Filter) {
        const {
            filter = [],
            sort = [],
            pagination: { page, pageSize },
        } = filterData || {};

        let list = RoomContracts.query().where("renter_ids", "like", `%${renterId}%`);

        // filter
        list = filterHandler(list, filter);

        // sort
        list = sortingHandler(list, sort);

        const clone = list.clone();
        const total = await clone.resultSize();
        const totalPages = Math.ceil(total / pageSize);

        // Pagination
        if (page !== -1 && pageSize !== -1) await list.page(page - 1, pageSize);
        else await list.page(0, total);

        const fetchData = await list;

        return { ...fetchData, page, pageCount: totalPages, pageSize, total };
    }

    static async findAllRoomContractByHouse(houseId: string, filterData: Filter) {
        const {
            filter = [],
            sort = [],
            pagination: { page, pageSize },
        } = filterData || {};

        const roomIds = await HouseService.getRoomIds(houseId);

        let list = RoomContracts.query().whereIn("room_id", roomIds);

        // filter
        list = filterHandler(list, filter);

        // sort
        list = sortingHandler(list, sort);

        const clone = list.clone();
        const total = await clone.resultSize();
        const totalPages = Math.ceil(total / pageSize);

        // Pagination
        if (page !== -1 && pageSize !== -1) await list.page(page - 1, pageSize);
        else await list.page(0, total);

        const fetchData = await list;

        return { ...fetchData, page, pageCount: totalPages, pageSize, total };
    }

    static async updateContractTemplate(id: string, contract: ContractUpdateRequest) {
        const contractDetails = await this.findOneContractTemplate(id);

        const filteredUpdates = Object.fromEntries(
            Object.entries(contract).filter(([_, value]) => value !== undefined)
        );

        if (contract.name !== contractDetails.name) {
            const isNameExists = await this.isNameExists(
                contractDetails.houseId,
                contractDetails.name,
                contractDetails.id
            );
            if (isNameExists) throw new ApiException(messageResponse.TEMPLATE_ALREADY_EXISTS, 409);
        }

        await contractDetails.$query().patchAndFetch(camelToSnake(filteredUpdates));

        return await this.findOneContractTemplate(id);
    }

    static async updateRoomContract(id: string, contract: RoomContractUpdateRequest) {
        const details = await this.findOneRoomContract(id);

        // if status is hold, cancel, terminate then cannot update
        if ([ContractStatus.HOLD, ContractStatus.CANCELLED, ContractStatus.TERMINATED].includes(details.status)) {
            throw new ApiException(messageResponse.CONTRACT_STATUS_PENDING_OR_ACTIVE_ONLY, 423);
        }

        if (contract.contractId) {
            const isValidContract = await this.isValidContract(details.roomId, contract.contractId);
            if (!isValidContract) {
                throw new ApiException(messageResponse.CONTRACT_NOT_FOUND, 404);
            }
        }

        const filteredUpdates = Object.fromEntries(
            Object.entries(contract).filter(([_, value]) => value !== undefined)
        );

        if (contract.roomId !== details.roomId) {
            const isExists = await RoomContracts.query()
                .where(camelToSnake({ roomId: contract.roomId }))
                .whereBetween("rental_start_date", [details.rentalStartDate, details.rentalEndDate])
                .orWhereBetween("rental_end_date", [details.rentalStartDate, details.rentalEndDate])
                .whereIn("status", [ContractStatus.ACTIVE, ContractStatus.PENDING, ContractStatus.HOLD])
                .andWhereNot("id", id);

            if (isExists.length) {
                throw new ApiException(messageResponse.CONTRACT_ALREADY_EXISTS, 409);
            }
        }

        const updatedContract = await RoomContracts.query().patchAndFetchById(id, camelToSnake(filteredUpdates));

        // update room status
        await RoomService.updateStatusByContract(
            updatedContract.roomId,
            updatedContract.status,
            updatedContract.updatedBy
        );

        await updatedContract.$query().patch({
            status: ContractStatus.PENDING,
            approvalStatus: ApprovalStatus.PENDING,
        });

        return await this.findOneRoomContract(id);
    }

    static async updateRoomContractStatusByLandlord(id: string, status: ContractStatus, actionBy: string) {
        const details = await this.findOneRoomContract(id);
        const currentStatus = details.status;

        // Define allowed status transitions
        const statusTransitions = {
            [ContractStatus.HOLD]: [ContractStatus.PENDING],
            [ContractStatus.ACTIVE]: [ContractStatus.HOLD, ContractStatus.TERMINATED, ContractStatus.CANCELLED],
            [ContractStatus.TERMINATED]: [ContractStatus.PENDING],
            [ContractStatus.PENDING]: [ContractStatus.HOLD, ContractStatus.TERMINATED, ContractStatus.CANCELLED],
        };

        // Check if the transition is allowed
        if (statusTransitions[currentStatus]?.includes(status)) {
            const updated = RoomContracts.query().patchAndFetchById(id, {
                status,
                updated_by: actionBy,
            });

            // update room status if contract status is active => rented
            await RoomService.updateStatusByContract(details.roomId, status, actionBy);

            return updated;
        }

        throw new ApiException(messageResponse.CONTRACT_STATUS_UPDATED_FAILED, 423);
    }

    static async updateRoomContractStatusByRenter(id: string, status: ApprovalStatus, note: string, actionBy: string) {
        const details = await this.findOneRoomContract(id);

        if (details.status !== ContractStatus.PENDING || details.approvalStatus !== ApprovalStatus.PENDING) {
            throw new ApiException(messageResponse.CONTRACT_STATUS_PENDING_ONLY, 423);
        }

        const updatedContract = await RoomContracts.query().patchAndFetchById(id, {
            approval_status: status,
            approval_by: actionBy,
            approval_date: currentDateTime(),
            approval_note: note,
            status: status === ApprovalStatus.APPROVED ? ContractStatus.ACTIVE : details.status,
        });

        return updatedContract;
    }

    static async deleteContractTemplate(id: string, deletedBy: string) {
        const contract = await this.findOneContractTemplate(id);

        await contract.$query().patch({ updatedBy: deletedBy });

        const isDeleted = await contract.$query().delete();
        return isDeleted;
    }

    static async deleteRoomContract(id: string, deletedBy: string) {
        const contract = await this.findOneRoomContract(id);

        if (contract.status !== ContractStatus.PENDING) {
            throw new ApiException(messageResponse.CONTRACT_STATUS_PENDING_ONLY, 423);
        }

        await contract.$query().patch({ updatedBy: deletedBy });
        const isDeleted = await contract.$query().delete();

        return isDeleted;
    }
}

export default ContractService;
