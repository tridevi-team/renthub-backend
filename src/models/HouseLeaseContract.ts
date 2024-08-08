import { Model } from "objection";

import { Houses, Users, HouseLeaseContractHistory } from ".";

class HouseLeaseContract extends Model {
    static get tableName() {
        return "house_lease_contract";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["house_id", "owner_name", "owner_phone", "owner_email", "price", "price_type", "start_date", "end_date", "created_by"],
            properties: {
                id: { type: "integer" },
                house_id: { type: "integer" },
                contract_template_id: { type: "integer" },
                renter_id: { type: "integer" },
                owner_name: { type: "string" },
                owner_phone: { type: "string" },
                owner_email: { type: "string" },
                price: { type: "integer" },
                price_type: { type: "integer" },
                deposit: { type: "integer" },
                received_deposit_at: { type: "datetime" },
                start_date: { type: "date" },
                end_date: { type: "date" },
                description: { type: "string" },
                created_by: { type: "integer" },
                created_at: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        return {
            houses: {
                relation: Model.BelongsToOneRelation,
                modelClass: Houses,
                join: {
                    from: "house_lease_contract.house_id",
                    to: "houses.id",
                },
            },

            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "house_lease_contract.created_by",
                    to: "users.id",
                },
            },

            house_lease_contract_history: {
                relation: Model.HasManyRelation,
                modelClass: HouseLeaseContractHistory,
                join: {
                    from: "house_lease_contract.id",
                    to: "house_lease_contract_history.house_lease_contract_id",
                },
            },
        };
    }
}

export default HouseLeaseContract;
