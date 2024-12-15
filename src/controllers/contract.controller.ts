import { ContractStatus, messageResponse, NotificationType, ServiceTypes } from "@enums";
import { ContractRequest, RoomContractRequest } from "@interfaces";
import { BillService, ContractService, NotificationService, RenterService } from "@services";
import { apiResponse, Exception, RedisUtils, snakeToCamel } from "@utils";
import { Model } from "objection";

const TEMPLATE_PREFIX: string = "templates";
const CONTRACT_PREFIX: string = "contracts";

class ContractController {
    static async getKeys(req, res) {
        try {
            const keys = await ContractService.getKeys();
            return res.json(apiResponse(messageResponse.GET_KEY_REPLACEMENT_SUCCESS, true, keys));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

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

            // delete all cache
            await RedisUtils.deletePattern(`${TEMPLATE_PREFIX}:*`);

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
                    room: { ...room, description: "." },
                    services,
                    equipment,
                    status: status || ContractStatus.PENDING,
                    createdBy: user.id,
                    updatedBy: user.id,
                },
                trx
            );
            trx.commit();

            await Model.knex().raw(`
                UPDATE room_contracts
                SET room = '${JSON.stringify(room)}'
                WHERE id = '${newContract.id}'
                `);

            // send notification to landlord and renters
            await NotificationService.create({
                title: "Hợp đồng cho phòng " + room.name + " của " + room.house.name,
                content: `Hợp đồng thuê phòng ${room.name} đã được tạo bởi ${user.fullName}. Vui lòng kiểm tra thông tin hợp đồng và xác nhận thông tin.`,
                type: NotificationType.SYSTEM,
                data: { contractId: newContract.id },
                recipients: [renterId],
            });

            await NotificationService.create({
                title: "Bạn đã tạo thành công hợp đồng cho phòng " + room.name + " của " + room.house.name,
                content: `Bạn đã tạo thành công hợp đồng thuê phòng ${room.name}. Vui lòng chờ xác nhận từ phía người thuê.`,
                type: NotificationType.SYSTEM,
                data: { contractId: newContract.id },
                recipients: [user.id],
            });
            // delete all cache
            await RedisUtils.deletePattern(`${CONTRACT_PREFIX}:*`);
            await RedisUtils.deletePattern(`houses:*`);
            await RedisUtils.deletePattern(`rooms:*`);
            await RedisUtils.deletePattern(`floors:*`);

            return res.json(apiResponse(messageResponse.CREATE_CONTRACT_SUCCESS, true, newContract));
        } catch (e) {
            trx.rollback();
            Exception.handle(e, req, res);
        }
    }

    static async getContractTemplateDetails(req, res) {
        const { templateId } = req.params;
        const key = `${TEMPLATE_PREFIX}:${templateId}:details`;
        try {
            const isExistsCache = await RedisUtils.isExists(key);
            if (isExistsCache) {
                const contract = await RedisUtils.getSetMembers(key);
                return res.json(
                    apiResponse(messageResponse.GET_TEMPLATE_DETAILS_SUCCESS, true, JSON.parse(contract[0]))
                );
            }

            const contract = await ContractService.findOneContractTemplate(templateId);

            const convertContract = snakeToCamel(contract);
            // set cache
            await RedisUtils.setAddMember(key, JSON.stringify(convertContract));

            return res.json(apiResponse(messageResponse.GET_TEMPLATE_DETAILS_SUCCESS, true, convertContract));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async getContractTemplates(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination } = req.query;

        const key = RedisUtils.generateCacheKeyWithFilter(`${TEMPLATE_PREFIX}:${houseId}:list`, {
            filter,
            sort,
            pagination,
        });

        try {
            const isExistsCache = await RedisUtils.isExists(key);
            if (isExistsCache) {
                const contracts = await RedisUtils.getSetMembers(key);
                return res.json(apiResponse(messageResponse.GET_TEMPLATE_LIST_SUCCESS, true, JSON.parse(contracts[0])));
            }

            const contracts = await ContractService.findAllContractTemplate(houseId, {
                filter,
                sort,
                pagination,
            });

            const convertContracts = snakeToCamel(contracts);

            // set cache
            await RedisUtils.setAddMember(key, JSON.stringify(convertContracts));

            return res.json(apiResponse(messageResponse.GET_TEMPLATE_LIST_SUCCESS, true, convertContracts));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async getRoomContractDetails(req, res) {
        const { contractId } = req.params;

        const key = `${CONTRACT_PREFIX}:${contractId}:details`;

        try {
            const isExistsCache = await RedisUtils.isExists(key);
            if (isExistsCache) {
                const contract = await RedisUtils.getSetMembers(key);
                return res.json(
                    apiResponse(messageResponse.GET_CONTRACT_DETAILS_SUCCESS, true, JSON.parse(contract[0]))
                );
            }

            const contract = await ContractService.findOneRoomContract(contractId);
            const replaceKeys = await ContractService.findKeyData(contractId);
            const convertContract = snakeToCamel(contract);
            // set cache
            await RedisUtils.setAddMember(key, JSON.stringify({ contract: convertContract, keys: replaceKeys }));

            return res.json(
                apiResponse(messageResponse.GET_CONTRACT_DETAILS_SUCCESS, true, {
                    contract: convertContract,
                    keys: replaceKeys,
                })
            );
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async getRoomContracts(req, res) {
        const { roomId } = req.params;
        const { filter = [], sort = [], pagination } = req.query;
        const user = req.user;
        const { isApp } = req;
        const key = RedisUtils.generateCacheKeyWithFilter(`${CONTRACT_PREFIX}:${roomId}:list_isApp_${isApp}`, {
            filter,
            sort,
            pagination,
        });

        try {
            const isExistsCache = await RedisUtils.isExists(key);
            if (isExistsCache) {
                const contracts = await RedisUtils.getSetMembers(key);
                return res.json(apiResponse(messageResponse.GET_CONTRACT_LIST_SUCCESS, true, JSON.parse(contracts[0])));
            }

            if (isApp && user.role === "renter") {
                // this is for renter
                console.log("[RENTER]" + user.name + " is getting contract list");
                const contracts = await ContractService.findAllRoomContractByRenter(user.id, {
                    filter,
                    sort,
                    pagination,
                });

                const convertContracts = snakeToCamel(contracts);

                // set cache
                await RedisUtils.setAddMember(key, JSON.stringify(convertContracts));

                return res.json(apiResponse(messageResponse.GET_CONTRACT_LIST_SUCCESS, true, convertContracts));
            }

            const contracts = await ContractService.findAllRoomContract(roomId, {
                filter,
                sort,
                pagination,
            });

            // set cache
            await RedisUtils.setAddMember(key, JSON.stringify(contracts));

            return res.json(apiResponse(messageResponse.GET_CONTRACT_LIST_SUCCESS, true, snakeToCamel(contracts)));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async getRoomContractsByHouse(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination } = req.query;

        const key = RedisUtils.generateCacheKeyWithFilter(`${CONTRACT_PREFIX}:${houseId}:list`, {
            filter,
            sort,
            pagination,
        });

        try {
            const isExistsCache = await RedisUtils.isExists(key);
            if (isExistsCache) {
                const contracts = await RedisUtils.getSetMembers(key);
                return res.json(apiResponse(messageResponse.GET_CONTRACT_LIST_SUCCESS, true, JSON.parse(contracts[0])));
            }

            const contracts = await ContractService.findAllRoomContractByHouse(houseId, {
                filter,
                sort,
                pagination,
            });

            const convertContracts = snakeToCamel(contracts);

            // set cache
            await RedisUtils.setAddMember(key, JSON.stringify(convertContracts));

            return res.json(apiResponse(messageResponse.GET_CONTRACT_LIST_SUCCESS, true, convertContracts));
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

            // delete all cache
            await RedisUtils.deletePattern(`${TEMPLATE_PREFIX}:*`);

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

            // delete all cache
            await RedisUtils.deletePattern(`${CONTRACT_PREFIX}:*`);
            await RedisUtils.deletePattern(`houses:*`);
            await RedisUtils.deletePattern(`rooms:*`);
            await RedisUtils.deletePattern(`floors:*`);

            return res.json(apiResponse(messageResponse.UPDATE_CONTRACT_SUCCESS, true, snakeToCamel(updatedContract)));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async updateRoomContractStatus(req, res) {
        const user = req.user;
        const { contractId } = req.params;
        const { status, note } = req.body;
        const isApp = req.isApp;
        try {
            if (user.role === "renter" || isApp) {
                // this is for renter
                console.log("[RENTER]" + user.name + " is updating contract status");
                await ContractService.updateRoomContractStatusByRenter(contractId, status, note, user.id);
            } else {
                // this is for landlord
                console.log("[LANDLORD]" + user.fullName + " is updating contract status");
                await ContractService.updateRoomContractStatusByLandlord(contractId, status, user.id);
            }

            // delete all cache
            await RedisUtils.deletePattern(`${CONTRACT_PREFIX}:*`);
            await RedisUtils.deletePattern(`houses:*`);
            await RedisUtils.deletePattern(`rooms:*`);
            await RedisUtils.deletePattern(`floors:*`);

            res.json(apiResponse(messageResponse.CONTRACT_STATUS_UPDATED_SUCCESS, true));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async extendContract(req, res) {
        const { contractId } = req.params;
        const { room, rentalStartDate, rentalEndDate, services, equipment, landlord, renter } = req.body;
        const user = req.user;

        const trx = await Model.startTransaction();

        try {
            await ContractService.extendContract(
                {
                    contractId,
                    rentalStartDate: rentalStartDate,
                    rentalEndDate: rentalEndDate,
                    room: room,
                    services: services,
                    equipment: equipment,
                    landlord: landlord,
                    renter: renter,
                },
                user.id,
                trx
            );

            trx.commit();

            // send notification to landlord and renters
            await NotificationService.create({
                title: "Gia hạn hợp đồng " + room.name + ", " + room.house.name,
                content: `Hợp đồng thuê phòng ${room.name} đã được gia hạn bởi ${user.fullName}. Vui lòng kiểm tra thông tin hợp đồng và xác nhận thông lại tin.`,
                type: NotificationType.SYSTEM,
                data: { contractId: contractId },
                recipients: [renter.id],
            });

            await NotificationService.create({
                title: "Bạn đã gia hạn hợp đồng " + room.name + ", " + room.house.name,
                content: `Bạn đã gia hạn hợp đồng thuê phòng ${room.name}. Vui lòng chờ xác nhận từ phía người thuê.`,
                type: NotificationType.SYSTEM,
                data: { contractId: contractId },
                recipients: [user.id],
            });

            // delete all cache
            await RedisUtils.deletePattern(`${CONTRACT_PREFIX}:*`);
            await RedisUtils.deletePattern(`houses:*`);
            await RedisUtils.deletePattern(`rooms:*`);
            await RedisUtils.deletePattern(`floors:*`);

            return res.json(apiResponse(messageResponse.EXTEND_CONTRACT_SUCCESS, true));
        } catch (error) {
            trx.rollback();
            Exception.handle(error, req, res);
        }
    }

    static async deleteContractTemplate(req, res) {
        const user = req.user;
        const { templateId } = req.params;
        try {
            await ContractService.deleteContractTemplate(templateId, user.id);

            // delete all cache
            await RedisUtils.deletePattern(`${TEMPLATE_PREFIX}:*`);

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

            // delete all cache
            await RedisUtils.deletePattern(`${CONTRACT_PREFIX}:*`);
            await RedisUtils.deletePattern(`houses:*`);
            await RedisUtils.deletePattern(`rooms:*`);
            await RedisUtils.deletePattern(`floors:*`);

            return res.json(apiResponse(messageResponse.DELETE_CONTRACT_SUCCESS, true));
        } catch (e) {
            Exception.handle(e, req, res);
        }
    }

    static async getLatestRoomContract(req, res) {
        const { roomId } = req.params;
        try {
            const contract = await ContractService.getLatestContract(roomId);
            const bill = await BillService.getLatestBill(roomId);

            const data = contract.services.map((service) => {
                console.log(service);

                const serviceBill = bill.details.find((billService) => billService.serviceId === service.id);

                if ([ServiceTypes.ELECTRICITY_CONSUMPTION, ServiceTypes.WATER_CONSUMPTION].includes(service.type)) {
                    return {
                        ...service,
                        oldIndex: serviceBill ? serviceBill.newIndex : 0,
                    };
                }
                return service;
            });

            return res.json(apiResponse(messageResponse.GET_SERVICES_LIST_SUCCESS, true, snakeToCamel(data)));
        } catch (error) {
            Exception.handle(error, req, res);
        }
    }
}

export default ContractController;
