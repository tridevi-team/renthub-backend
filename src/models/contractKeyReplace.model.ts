import { Model } from "objection";

class ContractKeyReplace extends Model {
    static get tableName() {
        return "contract_key_replace";
    }

    static get idColumn() {
        return "key";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["label"],
            properties: {
                key: { type: "string", maxLength: 255 },
                label: { type: "string", maxLength: 255 },
            },
        };
    }
}

export default ContractKeyReplace;
