import { Model } from "objection";

class ContractTemplate extends Model {
    static get tableName() {
        return "contract_template";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name", "content"],
            properties: {
                id: { type: "integer" },
                name: { type: "string" },
                content: { type: "string" },
                is_active: { type: "boolean" },
                created_by: { type: "integer" },
                created_at: { type: "datetime" },
            },
        };
    }
}

export default ContractTemplate;
