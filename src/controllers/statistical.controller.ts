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
                equipment: () => StatisticalService.countEquipment(houseId),
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
                let startDate, endDate;
                // get renterId from user
                const renterId = user.id;

                // search contract by renterId and roomId
                const { start, end } = await ContractService.findRangeRentDate(roomId, renterId);
                console.log("Rental start date: ", start);
                console.log("Rental end date: ", end);

                if (!start || !end) {
                    return res.json(apiResponse(messageResponse.GET_STATISTICAL_SUCCESS, true, {}));
                }
                // validate start date and end date
                if ((from > start && from < end) || (to > start && to < end)) {
                    startDate = from;
                    endDate = to;
                } else if (!from && !to) {
                    startDate = start;
                    endDate = end;
                } else if (!from) {
                    startDate = start;
                    endDate = to;
                } else if (!to) {
                    startDate = from;
                    endDate = end;
                } else {
                    startDate = start;
                    endDate = end;
                }

                // get data
                const turnover = await StatisticalService.barChartTurnoverByRoom(roomId, {
                    startDate,
                    endDate,
                });

                const serviceCompare = await StatisticalService.barChartServiceConsumptionEachMonthByRoom(roomId, {
                    startDate: from,
                    endDate: to,
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
