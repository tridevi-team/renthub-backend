import { messageResponse } from "@enums";
import { StatisticalService } from "@services";
import { apiResponse, Exception } from "@utils";

class StatisticalController {
    static async getStatisticalByHouse(req, res) {
        const { houseId } = req.params;
        const { from, to } = req.query;
        try {
            const [bills, issues, rooms, contracts, equipment] = await Promise.all([
                StatisticalService.countBillsByHouse(houseId, {
                    startDate: from,
                    endDate: to,
                }),
                StatisticalService.countIssuesByHouse(houseId, {
                    startDate: from,
                    endDate: to,
                }),
                StatisticalService.countRoomsByHouse(houseId),
                StatisticalService.countContractsByHouse(houseId, {
                    startDate: from,
                    endDate: to,
                }),
                StatisticalService.countEquipment(houseId),
            ]);

            return res.json(
                apiResponse(messageResponse.GET_STATISTICAL_SUCCESS, true, {
                    bills,
                    issues,
                    rooms,
                    contracts,
                    equipment,
                })
            );
        } catch (error) {
            Exception.handle(error, req, res);
        }
    }
}

export default StatisticalController;
