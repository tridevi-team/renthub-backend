import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";
import { Rooms } from "./";

class RoomImages extends Model {
    id: string;
    room_id: string;
    image_url: string;
    description: string;
    created_by: string;
    created_at: string;
    imageUrl: string;

    static get tableName() {
        return "room_images";
    }

    static get idColumn() {
        return "id";
    }

    $beforeInsert(queryContext: QueryContext): Promise<any> | void {
        this.id = this.id || uuidv4();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["room_id", "image_url", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                image_url: { type: "string", maxLength: 255 },
                description: { type: "string", maxLength: 255 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }

    static get relationMappings() {
        return {
            room: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "room_images.room_id",
                    to: "rooms.id",
                },
            },
        };
    }
}

export default RoomImages;
