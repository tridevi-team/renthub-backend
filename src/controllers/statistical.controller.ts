import { messageResponse } from "@enums";
import { StatisticalService } from "@services";
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
        console.log(modules);

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
}

export default StatisticalController;
