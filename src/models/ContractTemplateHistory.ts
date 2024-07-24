import { Model } from "objection";

class ContractTemplateHistory extends Model {
    static get tableName() {
        return "contract_template_history";
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
                type: { type: "string" },
            },
        };
    }
}

export default ContractTemplateHistory;
