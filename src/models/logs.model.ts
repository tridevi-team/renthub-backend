import { Model } from "objection";

class Logs extends Model {
    static get tableName() {
        return "logs";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["request_timestamp", "client_ip", "endpoint", "request_method", "status_code", "user_agent", "response_time_ms"],
            properties: {
                id: { type: "string", format: "uuid" },
                request_timestamp: { type: "string", format: "date-time" },
                client_ip: { type: "string", maxLength: 45 },
                endpoint: { type: "string", maxLength: 255 },
                request_method: { type: "string", enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"] },
                status_code: { type: "integer" },
                user_agent: { type: "string" },
                response_time_ms: { type: "integer" },
                referrer: { type: "string", maxLength: 255 },
                request_payload: { type: "string" },
                response_payload: { type: "string" },
                additional_info: { type: "object" },
            },
        };
    }
}

export default Logs;
