import { Model } from "objection";

import { HouseLeaseContract, Houses, Users } from ".";

class HouseLeaseContractHistory extends Model {
    static get tableName() {
        return "house_lease_contract_history";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["house_lease_contract_id", "house_id", "owner_name", "owner_phone", "owner_email", "start_date", "end_date", "created_by"],
            properties: {
                id: { type: "integer" },
                house_lease_contract_id: { type: "integer" },
                house_id: { type: "integer" },
                owner_name: { type: "string" },
                owner_phone: { type: "string" },
                owner_email: { type: "string" },
                file_contract: { type: "string" },
                start_date: { type: "date" },
                end_date: { type: "date" },
                description: { type: "string" },
                type: { type: "string" },
                created_by: { type: "integer" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }

    static relationMappings() {
        return {
            house_lease_contract: {
                relation: Model.BelongsToOneRelation,
                modelClass: HouseLeaseContract,
                join: {
                    from: "house_lease_contract_history.house_lease_contract_id",
                    to: "house_lease_contract.id",
                },
            },

            houses: {
                relation: Model.BelongsToOneRelation,
                modelClass: Houses,
                join: {
                    from: "house_lease_contract_history.house_id",
                    to: "houses.id",
                },
            },

            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "house_lease_contract_history.created_by",
                    to: "users.id",
                },
            },
        };
    }
}

export default HouseLeaseContractHistory;