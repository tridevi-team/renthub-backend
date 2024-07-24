import { Model } from "objection";

class ContractKeyReplace extends Model {
    static get tableName() {
        return "contract_key_replace";
    }

    static get jsonSchema() {
        return {
            type: "object",
            properties: {
                id: { type: "integer" },
                key: { type: "string" },
                label: { type: "string" },
            },
        };
    }
}

export default ContractKeyReplace;
