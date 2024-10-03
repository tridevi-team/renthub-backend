import messageResponse from "../enums/message.enum";
import { Equipment } from "../models";
import { ApiException } from "../utils";

class EquipmentService {
    static async getById(id: string) {
        const data = await Equipment.query().findById(id);
        if (!data) {
            throw new ApiException(messageResponse.EQUIPMENT_NOT_FOUND, 404);
        }
        return data;
    }
}

export default EquipmentService;
