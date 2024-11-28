import { ContractStatus, messageResponse } from "@enums";
import { ContractRequest, RoomContractRequest } from "@interfaces";
import { ContractService, RenterService } from "@services";
import { apiResponse, Exception, snakeToCamel } from "@utils";
import { Model } from "objection";

class ContractController {
    static async createContractTemplate(req, res) {
        const user = req.user;
        const { houseId } = req.params;
        const { name, content, landlord, isActive }: ContractRequest = req.body;
        try {
            // create contract template
            const newContract = await ContractService.createContractTemplate({
                houseId,
                name,
                content,
                landlord,
                isActive,
                createdBy: user.id,
                updatedBy: user.id,
            });

            return res.json(apiResponse(messageResponse.CREATE_TEMPLATE_SUCCESS, true, newContract));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async createRoomContract(req, res) {
        const user = req.user;
        const { roomId } = req.params;
        const {
            contractId,
            depositAmount,
            depositStatus,
            depositDate,
            depositRefund,
            depositRefundDate,
            rentalStartDate,
            rentalEndDate,
            status,
            renter,
            room,
            landlord,
            equipment,
            services,
        }: RoomContractRequest = req.body;

        const trx = await Model.startTransaction();

        try {
            let renterId: string | null = null;
            // create renter if not exists
            const isRenterExists = await RenterService.checkCitizenIdExists(renter.citizenId);

            if (isRenterExists) {
                renterId = isRenterExists.id;
            } else {
                const newRenter = await RenterService.create(
                    {
                        roomId: roomId,
                        name: renter.fullName,
                        gender: renter.gender,
                        citizenId: renter.citizenId,
                        email: renter.email,
                        phoneNumber: renter.phoneNumber,
                        moveInDate: rentalStartDate,
                        represent: true,
                        createdBy: user.id,
                        updatedBy: user.id,
                        address: renter.address,
                        birthday: renter.birthday,
                        tempReg: false,
                    },
                    trx
                );
                renterId = newRenter.id;
            }
            // create room contract
            const newContract = await ContractService.createRoomContract(
                {
                    roomId,
                    contractId,
                    landlord,
                    renter,
                    renterIds: renterId,
                    depositAmount,
                    depositStatus,
                    depositDate,
                    depositRefund,
                    depositRefundDate,
                    rentalStartDate,
                    rentalEndDate,
                    room,
                    services,
                    equipment,
                    status: status || ContractStatus.PENDING,
                    createdBy: user.id,
                    updatedBy: user.id,
                },
                trx
            );
            trx.commit();
            return res.json(apiResponse(messageResponse.CREATE_CONTRACT_SUCCESS, true, newContract));
        } catch (e) {
            trx.rollback();
            Exception.handle(e, req, res);
        }
    }

    static async getContractTemplateDetails(req, res) {
        const { templateId } = req.params;
        try {
            const contract = await ContractService.findOneContractTemplate(templateId);

            return res.json(apiResponse(messageResponse.GET_TEMPLATE_DETAILS_SUCCESS, true, contract));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async getContractTemplates(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination } = req.query;
        try {
            const contracts = await ContractService.findAllContractTemplate(houseId, {
                filter,
                sort,
                pagination,
            });

            return res.json(apiResponse(messageResponse.GET_TEMPLATE_LIST_SUCCESS, true, contracts));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async getRoomContractDetails(req, res) {
        const { contractId } = req.params;
        try {
            const contract = await ContractService.findOneRoomContract(contractId);

            return res.json(apiResponse(messageResponse.GET_CONTRACT_DETAILS_SUCCESS, true, snakeToCamel(contract)));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async getRoomContracts(req, res) {
        const { roomId } = req.params;
        const { filter = [], sort = [], pagination } = req.query;
        const user = req.user;
        const { isApp } = req;
        try {
            if (isApp && user.role === "renter") {
                // this is for renter
                console.log("[RENTER]" + user.name + " is getting contract list");
                const contracts = await ContractService.findAllRoomContractByRenter(user.id, {
                    filter,
                    sort,
                    pagination,
                });

                return res.json(apiResponse(messageResponse.GET_CONTRACT_LIST_SUCCESS, true, snakeToCamel(contracts)));
            }

            const contracts = await ContractService.findAllRoomContract(roomId, {
                filter,
                sort,
                pagination,
            });

            return res.json(apiResponse(messageResponse.GET_CONTRACT_LIST_SUCCESS, true, snakeToCamel(contracts)));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async getRoomContractsByHouse(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination } = req.query;
        try {
            const contracts = await ContractService.findAllRoomContractByHouse(houseId, {
                filter,
                sort,
                pagination,
            });
            console.log("🚀 ~ ContractController ~ getRoomContractsByHouse ~ contracts:", contracts);

            return res.json(apiResponse(messageResponse.GET_CONTRACT_LIST_SUCCESS, true, snakeToCamel(contracts)));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async updateContractTemplate(req, res) {
        const user = req.user;
        const { templateId } = req.params;
        const { name, content, isActive, landlord }: ContractRequest = req.body;
        try {
            const updatedContract = await ContractService.updateContractTemplate(templateId, {
                name,
                content,
                landlord,
                isActive,
                updatedBy: user.id,
            });

            return res.json(apiResponse(messageResponse.UPDATE_TEMPLATE_SUCCESS, true, snakeToCamel(updatedContract)));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async updateRoomContract(req, res) {
        const user = req.user;
        const { contractId } = req.params;
        const {
            roomId,
            depositAmount,
            depositStatus,
            depositDate,
            depositRefund,
            depositRefundDate,
            rentalStartDate,
            rentalEndDate,
            status,
        } = req.body;
        try {
            const updatedContract = await ContractService.updateRoomContract(contractId, {
                roomId,
                contractId: contractId,
                depositAmount: depositAmount,
                depositStatus: depositStatus,
                depositDate: depositDate,
                depositRefund: depositRefund,
                depositRefundDate: depositRefundDate,
                rentalStartDate: rentalStartDate,
                rentalEndDate: rentalEndDate,
                status: status,
                updatedBy: user.id,
            });

            return res.json(apiResponse(messageResponse.UPDATE_CONTRACT_SUCCESS, true, snakeToCamel(updatedContract)));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async updateRoomContractStatus(req, res) {
        const user = req.user;
        const { contractId } = req.params;
        const { status, note } = req.body;
        try {
            if (user.role === "renter") {
                // this is for renter
                console.log("[RENTER]" + user.name + " is updating contract status");
                await ContractService.updateRoomContractStatusByRenter(contractId, status, note, user.id);
            } else {
                // this is for landlord
                console.log("[LANDLORD]" + user.fullName + " is updating contract status");
                await ContractService.updateRoomContractStatusByLandlord(contractId, status, user.id);
            }
            res.json(apiResponse(messageResponse.CONTRACT_STATUS_UPDATED_SUCCESS, true));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async deleteContractTemplate(req, res) {
        const user = req.user;
        const { templateId } = req.params;
        try {
            await ContractService.deleteContractTemplate(templateId, user.id);

            return res.json(apiResponse(messageResponse.DELETE_TEMPLATE_SUCCESS, true));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async deleteRoomContract(req, res) {
        const user = req.user;
        const { contractId } = req.params;
        try {
            await ContractService.deleteRoomContract(contractId, user.id);

            return res.json(apiResponse(messageResponse.DELETE_CONTRACT_SUCCESS, true));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }
}

export default ContractController;
