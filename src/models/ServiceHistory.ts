// Table: service_history
// Columns:
// id int(11) AI PK
// service_id int(11)
// house_id int(11)
// name varchar(50)
// unit_price float
// type varchar(10)
// action_type varchar(10)
// has_index tinyint(1)
// rules text
// created_by int(11)
// created_at datetime

import { Model } from "objection";

import { Houses, Services, Users } from ".";

class ServiceHistory extends Model {
    static get tableName() {
        return "service_history";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["service_id", "house_id", "name", "unit_price", "type", "action_type", "created_by"],
            properties: {
                id: { type: "integer" },
                service_id: { type: "integer" },
                house_id: { type: "integer" },
                name: { type: "string" },
                unit_price: { type: "float" },
                type: { type: "string" },
                action_type: { type: "string" },
                has_index: { type: "boolean" },
                rules: { type: "string" },
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
                    from: "service_history.house_id",
                    to: "houses.id",
                },
            },

            services: {
                relation: Model.BelongsToOneRelation,
                modelClass: Services,
                join: {
                    from: "service_history.service_id",
                    to: "services.id",
                },
            },

            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "service_history.created_by",
                    to: "users.id",
                },
            },
        };
    }
}

export default ServiceHistory;