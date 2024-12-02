import type { QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";

class Logs extends Model {
    id: string;
    request_timestamp: Date;
    client_ip: string;
    endpoint: string;
    request_method: string;
    status_code: number;
    user_agent: string;
    response_time_ms: number;
    referrer: string;
    request_payload: object;
    response_payload: object;
    additional_info: any;

    static get tableName() {
        return "logs";
    }

    static get idColumn() {
        return "id";
    }

    $beforeInsert(_queryContext: QueryContext): Promise<any> | void {
        this.id = this.id || uuidv4();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: [
                "client_ip",
                "endpoint",
                "request_method",
                "status_code",
                "user_agent",
                "response_time_ms",
            ],
            properties: {
                id: { type: "string", format: "uuid" },
                request_timestamp: { type: "string", format: "date-time" },
                client_ip: { type: "string", maxLength: 45 },
                endpoint: { type: "string", maxLength: 255 },
                request_method: {
                    type: "string",
                    enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
                },
                status_code: { type: "integer" },
                user_agent: { type: "string" },
                response_time_ms: { type: "number" },
                referrer: { type: "string", maxLength: 255 },
                request_payload: { type: "object" },
                response_payload: { type: "object" },
                additional_info: { type: "object" },
            },
        };
    }
}

export default Logs;
