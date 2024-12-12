import "dotenv/config";
import { Model } from "objection";
import { BillStatus, messageResponse, NotificationType, ServiceTypes } from "../enums";
import { BillInfo } from "../interfaces";
import { Bills } from "../models";
import {
    BillService,
    HouseService,
    NotificationService,
    PaymentService,
    RenterService,
    RoomService,
} from "../services";
import { ApiException, apiResponse, camelToSnake, Exception, RedisUtils, removeVietnameseTones } from "../utils";

const { RETURN_URL, CANCEL_URL } = process.env;
const prefix = "bills";
class BillController {
    static async getBillDetails(req, res) {
        const { billId } = req.params;
        const cacheKey = RedisUtils.generateCacheKeyWithId(prefix, billId, "details");

        try {
            // check redis cache
            const isCacheExists = await RedisUtils.isExists(cacheKey);
            if (isCacheExists) {
                const cacheData = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.GET_BILL_DETAILS_SUCCESS, true, JSON.parse(cacheData[0])));
            }

            const bill = await BillService.getById(billId);

            return res.json(apiResponse(messageResponse.GET_BILL_DETAILS_SUCCESS, true, bill));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getBills(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination } = req.query;
        const cacheKey = RedisUtils.generateCacheKeyWithFilter(prefix, {
            filter,
            sort,
            pagination,
        });

        try {
            const isCacheExists = await RedisUtils.isExists(cacheKey);
            if (isCacheExists) {
                const cacheData = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.GET_BILL_LIST_SUCCESS, true, JSON.parse(cacheData[0])));
            }

            const bills = await BillService.search(houseId, {
                filter,
                sort,
                pagination,
            });

            await RedisUtils.setAddMember(cacheKey, JSON.stringify(bills));

            return res.json(apiResponse(messageResponse.GET_BILL_LIST_SUCCESS, true, bills));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getDataForUpdate(req, res) {
        const { ids } = req.body;
        try {
            const cacheKey = RedisUtils.generateCacheKeyWithId(prefix, "update", ids.join("_"));
            const isCacheExists = await RedisUtils.isExists(cacheKey);
            if (isCacheExists) {
                const cacheData = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.GET_BILL_LIST_SUCCESS, true, JSON.parse(cacheData[0])));
            }

            const bills = await BillService.dataListForUpdate(ids);

            await RedisUtils.setAddMember(cacheKey, JSON.stringify(bills));

            return res.json(apiResponse(messageResponse.GET_BILL_LIST_SUCCESS, true, bills));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async createBill(req, res) {
        const { houseId } = req.params;
        const { data } = req.body;
        const user = req.user;

        const trx = await Model.startTransaction(); // Start a new transaction

        try {
            const houseDetails = await HouseService.getHouseById(houseId);
            const paymentMethod = await PaymentService.getDefaultPaymentMethod(houseId);

            for (const bill of data) {
                // check if room exists in house
                const isRoomExists = await HouseService.isRoomInHouse(houseId, bill.roomId);
                if (!isRoomExists) throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);

                // check if services exist in room
                const roomServices = await RoomService.getServicesInContract(bill.roomId);
                const serviceIds = roomServices.map((service) => service.id);
                const isServicesExists = bill.services.every((service) => serviceIds.includes(service.id));
                if (!isServicesExists) throw new ApiException(messageResponse.SERVICE_NOT_FOUND, 404);

                const billMonth = new Date(bill.endDate).getMonth() + 1;
                const billYear = new Date(bill.endDate).getFullYear();
                const defaultTitle = `Hóa đơn tháng ${billMonth}-${billYear}`;

                const bilLData: BillInfo = {
                    roomId: bill.roomId,
                    paymentMethodId: paymentMethod?.id,
                    title: bill.title || defaultTitle,
                    date: {
                        from: bill.startDate,
                        to: bill.endDate,
                    },
                    createdBy: user.id,
                    updatedBy: user.id,
                };

                // Create the bill within the transaction
                const newBill = await BillService.create(bilLData, trx);

                let total = 0;

                // Get room price
                const roomDetails = await RoomService.getRoomById(bill.roomId);
                const roomPrice = roomDetails.price;

                const items: {
                    name: string;
                    unitPrice: number;
                    amount: number;
                    totalPrice: number;
                }[] = [];

                const detailsData = {
                    billId: newBill.id,
                    name: "Tiền phòng",
                    amount: 1,
                    unitPrice: roomPrice,
                    totalPrice: roomPrice,
                    description: "",
                    createdBy: user.id,
                    updatedBy: user.id,
                };

                total += detailsData.totalPrice;

                // Create bill details within the transaction
                await BillService.createDetails(newBill.id, detailsData, trx);

                items.push({
                    name: "Tiền phòng",
                    unitPrice: roomPrice,
                    amount: 1,
                    totalPrice: roomPrice,
                });
                const detailsList: {
                    billId: string;
                    serviceId?: string;
                    name: string;
                    oldValue?: number;
                    newValue?: number;
                    amount: number;
                    unitPrice: number;
                    totalPrice: number;
                    description: string;
                    createdBy: any;
                    updatedBy: any;
                }[] = [];
                await Promise.all(
                    roomServices.map(async (service) => {
                        let oldValue = 0,
                            newValue = 0,
                            amount = 0,
                            totalPrice = 0;
                        if (
                            [ServiceTypes.ELECTRICITY_CONSUMPTION, ServiceTypes.WATER_CONSUMPTION].includes(
                                service.type as ServiceTypes
                            )
                        ) {
                            const serviceInput = bill.services.find((item) => item.id === service.id);
                            oldValue = serviceInput?.oldValue || 0;
                            newValue = serviceInput?.newValue || 0;
                            amount = newValue - oldValue;
                            totalPrice = service.unitPrice * amount;
                        } else if (service.type === ServiceTypes.PEOPLE) {
                            const numOfRenters = await RoomService.countRenterInRoom(bill.roomId);
                            amount = numOfRenters;
                            totalPrice = service.unitPrice * amount;
                        } else if (service.type === ServiceTypes.ROOM) {
                            amount = 1;
                            totalPrice = service.unitPrice * amount;
                        }

                        const detailsData = {
                            billId: newBill.id,
                            serviceId: service.id,
                            name: service.name,
                            oldValue,
                            newValue,
                            amount,
                            unitPrice: service.unitPrice,
                            totalPrice,
                            description: "",
                            createdBy: user.id,
                            updatedBy: user.id,
                        };

                        items.push({
                            name: service.name,
                            unitPrice: service.unitPrice,
                            amount,
                            totalPrice,
                        });

                        detailsList.push(detailsData);

                        total += detailsData.totalPrice;
                        await BillService.createDetails(newBill.id, detailsData, trx);
                    })
                );

                if (paymentMethod) {
                    const orderCode = (new Date().getTime() + Math.floor(Math.random() * 1000)).toString();
                    const description = removeVietnameseTones(`${roomDetails.name} ${houseDetails.name}`).slice(0, 20);
                    const expiredDate = Math.floor(
                        (new Date().getTime() + houseDetails.numCollectDays * 24 * 60 * 60 * 1000) / 1000
                    );
                    const payosRequest = {
                        orderCode,
                        amount: total,
                        description,
                        items,
                        returnUrl: RETURN_URL,
                        cancelUrl: CANCEL_URL,
                        expiredAt: expiredDate,
                    };
                    await PaymentService.createPaymentLink(paymentMethod.id, payosRequest);

                    await newBill.$query(trx).patch(camelToSnake({ amount: total, payosRequest }));
                }

                await newBill.$query(trx).patch(camelToSnake({ amount: total }));

                // get renter in room
                const renters = await RenterService.listByRoom(bill.roomId);
                const renterIds = renters.results.map((renter) => renter.id);

                await NotificationService.create(
                    {
                        title: newBill.title,
                        content: `Hóa đơn ${newBill.title} đã được tạo. Vui lòng kiểm tra thông tin và thanh toán.`,
                        type: NotificationType.REMINDER,
                        data: { billId: newBill.id },
                        recipients: renterIds,
                        createdBy: user.id,
                    },
                    trx
                );
            }

            await trx.commit(); // Commit the transaction if everything succeeds

            // delete cache
            const cacheKey = `${prefix}:*`;
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.CREATE_BILL_SUCCESS, true));
        } catch (err) {
            await trx.rollback(); // Rollback the transaction in case of error
            Exception.handle(err, req, res);
        }
    }

    static async updateBills(req, res) {
        const { data } = req.body;
        const user = req.user;

        try {
            for (const bill of data) {
                const billDetails = await BillService.getById(bill.id);
                if (billDetails.status === BillStatus.PAID || billDetails.status === BillStatus.CANCELLED) {
                    throw new ApiException(messageResponse.BILL_STATUS_PAID_OR_CANCELLED, 409);
                }
                let total = 0;

                for (const service of bill.services) {
                    const trx = await Bills.startTransaction(); // Start a new transaction
                    try {
                        if (service.serviceId) {
                            const services = await RoomService.getServicesInContract(billDetails.roomId);
                            const serviceDetails = services.find((item) => item.id === service.serviceId);
                            if (!serviceDetails) throw new ApiException(messageResponse.SERVICE_NOT_FOUND, 404);

                            switch (serviceDetails.type) {
                                case ServiceTypes.WATER_CONSUMPTION:
                                case ServiceTypes.ELECTRICITY_CONSUMPTION:
                                    let serviceAmount = 0;
                                    let unitPrice = 0;
                                    let totalPrice = 0;
                                    const oldValue = service.oldValue || billDetails.services.oldValue;
                                    const newValue = service.newValue || billDetails.services.newValue;
                                    serviceAmount = newValue - oldValue;
                                    unitPrice = service.unitPrice || serviceDetails.unitPrice;
                                    totalPrice = unitPrice * serviceAmount;
                                    total += totalPrice;

                                    await BillService.updateDetails(
                                        {
                                            billId: bill.id,
                                            serviceId: service.serviceId,
                                            oldValue: oldValue,
                                            newValue: newValue,
                                            amount: serviceAmount,
                                            unitPrice: unitPrice,
                                            totalPrice: totalPrice,
                                            updatedBy: user.id,
                                        },
                                        trx
                                    );
                                    break;
                                case ServiceTypes.PEOPLE:
                                    const numOfRenters = await RoomService.countRenterInRoom(billDetails.roomId);
                                    const peopleUnitPrice = service.unitPrice || serviceDetails.unitPrice;
                                    const peopleAmount = numOfRenters;
                                    const peopleTotalPrice = peopleUnitPrice * peopleAmount;
                                    total += peopleTotalPrice;

                                    await BillService.updateDetails(
                                        {
                                            billId: bill.id,
                                            serviceId: service.serviceId,
                                            amount: peopleAmount,
                                            unitPrice: peopleUnitPrice,
                                            totalPrice: peopleTotalPrice,
                                            updatedBy: user.id,
                                        },
                                        trx
                                    );
                                    break;
                                case ServiceTypes.ROOM:
                                    const roomUnitPrice = service.unitPrice || serviceDetails.unitPrice;
                                    const roomAmount = 1;
                                    const roomTotalPrice = roomUnitPrice * roomAmount;
                                    total += roomTotalPrice;

                                    await BillService.updateDetails(
                                        {
                                            billId: bill.id,
                                            serviceId: service.serviceId,
                                            amount: roomAmount,
                                            unitPrice: roomUnitPrice,
                                            totalPrice: roomTotalPrice,
                                            updatedBy: user.id,
                                        },
                                        trx
                                    );
                                    break;

                                default:
                                    break;
                            }
                        } else {
                            // check bill details exists
                            const checkBillDetails = await BillService.getBillDetails(bill.id, service.name);
                            if (!checkBillDetails) throw new ApiException(messageResponse.BILL_NOT_FOUND, 404);

                            const serviceUnitPrice = service.unitPrice || checkBillDetails.unitPrice;
                            const serviceAmount = service.amount || checkBillDetails.amount;
                            const serviceTotalPrice = serviceUnitPrice * serviceAmount;
                            total += serviceTotalPrice;

                            await BillService.updateDetails(
                                {
                                    billId: bill.id,
                                    name: service.name,
                                    amount: serviceAmount,
                                    unitPrice: serviceUnitPrice,
                                    totalPrice: serviceTotalPrice,
                                    updatedBy: user.id,
                                },
                                trx
                            );
                        }

                        const details = await BillService.getServicesInBill(bill.id);

                        if (billDetails.paymentMethodId) {
                            const payosRequest = await BillService.getPayOSRequest(bill.id);
                            const parsedPayosRequest = JSON.parse(payosRequest);
                            parsedPayosRequest.items = details;
                            await BillService.updateInfo(bill.id, { payosRequest: parsedPayosRequest }, trx);
                        }

                        await BillService.updateInfo(bill.id, { amount: total }, trx);

                        // create notification
                        const renters = await RenterService.listByRoom(billDetails.roomId);

                        const renterIds = renters.results.map((renter) => renter.id);

                        await NotificationService.create(
                            {
                                title: billDetails.title,
                                content: `Hóa đơn ${billDetails.title} đã được cập nhật. Vui lòng kiểm tra lại thông tin và thanh toán.`,
                                type: NotificationType.REMINDER,
                                data: { billId: billDetails.id },
                                recipients: renterIds,
                                createdBy: user.id,
                            },
                            trx
                        );

                        await trx.commit();
                    } catch (err) {
                        await trx.rollback();
                        throw err;
                    }
                }
            }

            // delete cache
            const cacheKey = `${prefix}:*`;
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.UPDATE_BILL_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateStatus(req, res) {
        const { data } = req.body;
        const user = req.user;
        const trx = await Bills.startTransaction();
        try {
            for (const item of data) {
                await BillService.updateStatus(item.id, item.status, user.id, trx);
            }

            await trx.commit();

            // delete cache
            const cacheKey = `${prefix}:*`;
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.UPDATE_BILL_STATUS_SUCCESS, true));
        } catch (err) {
            trx.rollback();
            Exception.handle(err, req, res);
        }
    }

    static async deleteServiceInBill(req, res) {
        const { data } = req.body;
        const user = req.user;
        const trx = await Bills.startTransaction();
        try {
            for (const item of data) {
                await BillService.deleteService(item.billId, item.key, user.id, trx);

                const billData = await BillService.getById(item.billId);
                const roomData = await RoomService.getRoomById(billData.roomId);

                // update total amount
                const details = await BillService.getServicesInBill(item.billId, trx);
                let total = 0;
                for (const detail of details) {
                    total += detail.totalPrice;
                }

                if (billData.paymentMethodId) {
                    // update payos request
                    const payosRequest = await BillService.getPayOSRequest(item.billId);
                    const parsedPayosRequest = JSON.parse(payosRequest);
                    let updatedPayosRequest = parsedPayosRequest;
                    if (!parsedPayosRequest) {
                        const orderCode = (new Date().getTime() + Math.floor(Math.random() * 1000)).toString();
                        updatedPayosRequest = {
                            orderCode: orderCode,
                            amount: total,
                            description: `${roomData.name} ${roomData.house.name}`,
                            items: [],
                        };
                    }

                    updatedPayosRequest.items = details;

                    await BillService.updateInfo(item.billId, { payosRequest: updatedPayosRequest }, trx);
                }

                await BillService.updateInfo(item.billId, { amount: total }, trx);
            }

            await trx.commit();

            // delete cache
            const cacheKey = `${prefix}:*`;
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.DELETE_SERVICE_IN_BILL_SUCCESS, true));
        } catch (err) {
            trx.rollback();
            Exception.handle(err, req, res);
        }
    }
}

export default BillController;
