import type { QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import { NotificationType } from "../enums";
import { NotificationRecipients } from "./";
class Notifications extends Model {
    id: string;
    title: string;
    content: string;
    image_url: string;
    type: string;
    data: object;
    created_by: string;
    created_at: string;
    naviGateTo: string;
    createdBy: string;
    createdAt: string;
    recipients: NotificationRecipients[];
    imageUrl: string;

    static get tableName() {
        return "notifications";
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
            required: ["title", "content", "type", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                title: { type: "string", maxLength: 255 },
                content: { type: "string" },
                image_url: { type: "string" },
                type: { type: "string", maxLength: 10, enum: Object.values(NotificationType) },
                data: { type: "object" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }

    static get relationMappings() {
        return {
            recipients: {
                relation: Model.HasManyRelation,
                modelClass: NotificationRecipients,
                join: {
                    from: "notifications.id",
                    to: "notification_recipients.notification_id",
                },
            },
        };
    }
}

export default Notifications;
