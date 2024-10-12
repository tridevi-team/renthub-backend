import "dotenv/config";
import { BillStatus, messageResponse, ServiceTypes } from "../enums";
import { BillInfo } from "../interfaces";
import { Bills } from "../models";
import { HouseService, PaymentService, RoomService } from "../services";
import BillService from "../services/bill.service";
import { ApiException, apiResponse, Exception } from "../utils";
import camelToSnake from "../utils/camelToSnake";

const { RETURN_URL, CANCEL_URL } = process.env;

class BillController {
    static async getBillDetails(req, res) {
        const { billId } = req.params;

        try {
            const bill = await BillService.getById(billId);

            return res.json(apiResponse(messageResponse.GET_BILL_DETAILS_SUCCESS, true, bill));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getBills(req, res) {
        const { houseId } = req.params;
        const { filter = {}, sort = [], page, limit } = req.query;
        const sortValues = ["name", "title", "amount", "status", "date.from", "date.to", "createdAt", "updatedAt"];

        try {
            // Validate sort fields
            for (const item of sort) {
                const sortField = item.startsWith("-") ? item.slice(1) : item; // Remove leading '-' if present
                if (!sortValues.includes(sortField)) {
                    throw new ApiException(messageResponse.INVALID_SORT_VALUE, 400);
                }
            }

            const bills = await BillService.search(houseId, filter, sort, { page: page || -1, limit: limit || -1 });
            return res.json(apiResponse(messageResponse.GET_BILL_LIST_SUCCESS, true, bills));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getDataForUpdate(req, res) {
        const { ids } = req.body;
        try {
            const bills = await BillService.dataListForUpdate(ids);
            return res.json(apiResponse(messageResponse.GET_BILL_LIST_SUCCESS, true, bills));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async createBill(req, res) {
        const { houseId } = req.params;
        const { data } = req.body;
        const user = req.user;

        const trx = await Bills.startTransaction(); // Start a new transaction

        try {
            const houseDetails = await HouseService.getHouseById(houseId);

            for (const bill of data) {
                // check if room exists in house
                const isRoomExists = await HouseService.isRoomInHouse(houseId, bill.roomId);
                if (!isRoomExists) throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);

                // check if services exist in room
                const roomServices = await RoomService.getRoomServices(bill.roomId);
                const serviceIds = roomServices.map((service) => service.id);
                const isServicesExists = bill.services.every((service) => serviceIds.includes(service.id));
                if (!isServicesExists) throw new ApiException(messageResponse.SERVICE_NOT_FOUND, 404);

                const billMonth = new Date(bill.endDate).getMonth() + 1;
                const billYear = new Date(bill.endDate).getFullYear();
                const defaultTitle = `Hóa đơn tháng ${billMonth}-${billYear}`;

                const bilLData: BillInfo = {
                    roomId: bill.roomId,
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
                        if (service.type === ServiceTypes.AMOUNT) {
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

                if (data.paymentMethodId) {
                    const orderCode = (new Date().getTime() + Math.floor(Math.random() * 1000)).toString();
                    const description = `${roomDetails.name} ${houseDetails.name}`;
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
                    const url = await PaymentService.createPaymentLink(data.paymentMethodId, payosRequest);
                    console.log("🚀 ~ BillController ~ createBill ~ url:", url);
                    await newBill.$query(trx).patch(camelToSnake({ amount: total, payosRequest }));
                }

                await newBill.$query(trx).patch(camelToSnake({ amount: total }));
            }

            await trx.commit(); // Commit the transaction if everything succeeds
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
                            const serviceDetails = await HouseService.getServiceDetails(service.serviceId);

                            switch (serviceDetails.type) {
                                case ServiceTypes.AMOUNT:
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

                        await trx.commit();
                    } catch (err) {
                        await trx.rollback();
                        throw err;
                    }
                }
            }
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

            return res.json(apiResponse(messageResponse.DELETE_SERVICE_IN_BILL_SUCCESS, true));
        } catch (err) {
            trx.rollback();
            Exception.handle(err, req, res);
        }
    }
}

export default BillController;
