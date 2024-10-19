import { Model } from "objection";

class NotificationRecipients extends Model {
    static get tableName() {
        return "notification_recipients";
    }

    static get idColumn() {
        return "notification_id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["notification_id", "recipient_id"],
            properties: {
                notification_id: { type: "string", format: "uuid" },
                recipient_id: { type: "string", format: "uuid" },
                status: { type: "string", maxLength: 10 },
            },
        };
    }
}

export default NotificationRecipients;
