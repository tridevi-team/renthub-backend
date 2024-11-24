import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import { ContractStatus, DepositStatus } from "../enums";
import { currentDateTime } from "../utils/currentTime";

class RoomContracts extends Model {
    id: string;
    room_id: string;
    renter_id: string;
    contract_id: string;
    deposit_amount: number;
    deposit_status: DepositStatus;
    deposit_date: string;
    deposit_refund: number;
    deposit_refund_date: string;
    rental_start_date: string;
    rental_end_date: string;
    status: ContractStatus;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    roomId: string;
    renterId: string;
    contractId: string;
    depositAmount: number;
    depositStatus: DepositStatus;
    depositDate: string;
    depositRefund: number;
    depositRefundDate: string;
    rentalStartDate: string;
    rentalEndDate: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;

    static get tableName() {
        return "room_contracts";
    }

    static get idColumn() {
        return "id";
    }

    $beforeInsert(_queryContext: QueryContext): Promise<any> | void {
        this.id = this.id || uuidv4();
    }

    $beforeUpdate(_opt: ModelOptions, _queryContext: QueryContext): Promise<any> | void {
        this.updated_at = currentDateTime();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: [
                "room_id",
                "contract_id",
                "deposit_amount",
                "deposit_status",
                "deposit_date",
                "rental_start_date",
                "rental_end_date",
                "created_by",
            ],
            properties: {
                id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                renter_id: { type: "string", format: "uuid" },
                contract_id: { type: "string", format: "uuid" },
                deposit_amount: { type: "integer" },
                deposit_status: { type: "string" },
                deposit_date: { type: "string" },
                deposit_refund: { type: "integer" },
                deposit_refund_date: { type: "string" },
                rental_start_date: { type: "string" },
                rental_end_date: { type: "string" },
                status: { type: "string", maxLength: 255 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default RoomContracts;
