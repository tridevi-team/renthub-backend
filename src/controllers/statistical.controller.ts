import { messageResponse } from "@enums";
import { ContractService, StatisticalService } from "@services";
import { apiResponse, Exception } from "@utils";

class StatisticalController {
    static async getStatisticalCountsByHouse(req, res) {
        const { houseId } = req.params;
        const { from, to, modules = [] } = req.query;

        try {
            const moduleActions = {
                bills: () =>
                    StatisticalService.countBillsByHouse(houseId, {
                        startDate: from,
                        endDate: to,
                    }),
                issues: () =>
                    StatisticalService.countIssuesByHouse(houseId, {
                        startDate: from,
                        endDate: to,
                    }),
                rooms: () => StatisticalService.countRoomsByHouse(houseId),
                contracts: () =>
                    StatisticalService.countContractsByHouse(houseId, {
                        startDate: from,
                        endDate: to,
                    }),
                equipment: () => StatisticalService.countEquipment({ houseId }),
            };

            const selectedModules = modules.length
                ? modules.filter((module) => moduleActions.hasOwnProperty(module))
                : Object.keys(moduleActions);

            const results = await Promise.all(selectedModules.map((module) => moduleActions[module]()));

            const response = selectedModules.reduce(
                (acc, module, index) => ({
                    ...acc,
                    [module]: results[index],
                }),
                {}
            );

            return res.json(apiResponse(messageResponse.GET_STATISTICAL_SUCCESS, true, response));
        } catch (error) {
            Exception.handle(error, req, res);
        }
    }

    static async getStatisticalChartByHouse(req, res) {
        const { houseId } = req.params;
        const { from, to, modules = [] } = req.query;

        try {
            // pie chart consumption
            const moduleActions = {
                pieChartConsumption: () =>
                    StatisticalService.pieChartServiceConsumption(houseId, { startDate: from, endDate: to }),
                barChartConsumption: () =>
                    StatisticalService.barChartServiceConsumption(houseId, { startDate: from, endDate: to }),
                barChartTurnover: () => StatisticalService.barChartTurnover(houseId, { startDate: from, endDate: to }),
                barChartByBillStatus: () =>
                    StatisticalService.barChartByBillStatus(houseId, { startDate: from, endDate: to }),
            };

            const selectedModules = modules.length
                ? modules.filter((module) => moduleActions.hasOwnProperty(module))
                : Object.keys(moduleActions);

            const results = await Promise.all(selectedModules.map((module) => moduleActions[module]()));

            const data = selectedModules.reduce(
                (acc, module, index) => ({
                    ...acc,
                    [module]: results[index],
                }),
                {}
            );

            return res.json(apiResponse(messageResponse.GET_STATISTICAL_SUCCESS, true, data));
        } catch (error) {
            Exception.handle(error, req, res);
        }
    }

    static async getStatisticalChartByRoom(req, res) {
        const { roomId } = req.params;
        const { from, to } = req.query;
        const { user, isApp } = req;
        try {
            if (isApp) {
                // get renterId from user
                const renterId = user.id;

                // Search contract by renterId and roomId
                const { rentalStartDate, rentalEndDate } = await ContractService.findRangeRentDate(roomId, renterId);
                let startDate = rentalStartDate;
                let endDate = rentalEndDate;

                console.log("Rental date: ", rentalStartDate, rentalEndDate);
                console.log("Date range: ", from, to);

                if (!rentalStartDate || !rentalEndDate) {
                    return res.json(apiResponse(messageResponse.GET_STATISTICAL_SUCCESS, true, {}));
                }

                if (new Date(from) > new Date(rentalStartDate)) {
                    startDate = from;
                } else if (new Date(from) > new Date(rentalEndDate)) {
                    return res.json(apiResponse(messageResponse.GET_STATISTICAL_SUCCESS, true, {}));
                }

                if (new Date(to) > new Date(rentalEndDate)) {
                    endDate = rentalEndDate;
                    console.log("End date: ", endDate);
                } else if (new Date(to) < new Date(rentalStartDate)) {
                    return res.json(apiResponse(messageResponse.GET_STATISTICAL_SUCCESS, true, {}));
                }

                // get data
                const turnover = await StatisticalService.barChartTurnoverByRoom(roomId, {
                    startDate,
                    endDate,
                });

                const serviceCompare = await StatisticalService.barChartServiceConsumptionEachMonthByRoom(roomId, {
                    startDate,
                    endDate,
                });

                const serviceConsumption = await StatisticalService.pieChartServiceConsumptionByRoom(roomId, {
                    startDate,
                    endDate,
                });

                return res.json(
                    apiResponse(messageResponse.GET_STATISTICAL_SUCCESS, true, {
                        turnover,
                        serviceCompare,
                        serviceConsumption,
                    })
                );
            }

            const turnover = await StatisticalService.barChartTurnoverByRoom(roomId, {
                startDate: from,
                endDate: to,
            });

            const serviceCompare = await StatisticalService.barChartServiceConsumptionEachMonthByRoom(roomId, {
                startDate: from,
                endDate: to,
            });

            const serviceConsumption = await StatisticalService.pieChartServiceConsumptionByRoom(roomId, {
                startDate: from,
                endDate: to,
            });

            return res.json(
                apiResponse(messageResponse.GET_STATISTICAL_SUCCESS, true, {
                    turnover,
                    serviceCompare,
                    serviceConsumption,
                })
            );
        } catch (error) {
            Exception.handle(error, req, res);
        }
    }
}

export default StatisticalController;
