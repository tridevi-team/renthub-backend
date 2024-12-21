import { currentDateTime } from "@utils/currentTime";
import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import { Equipment, HouseFloors, Houses, Rooms, Users } from "./";

class Issues extends Model {
    id: string;
    house_id: string;
    floor_id: string;
    room_id: string;
    equipment_id: string;
    title: string;
    content: string;
    status: string;
    description?: string;
    files: {
        image: string[];
        video: string[];
        file: string[];
    };
    assign_to: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    houseId: string;
    floorId: string;
    roomId: string;
    equipmentId: string;
    assignTo: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    count: number;

    static get tableName() {
        return "issues";
    }

    static get idColumn() {
        return "id";
    }

    $beforeInsert(_queryContext: QueryContext): Promise<any> | void {
        this.id = this.id || uuidv4();
    }

    $beforeUpdate(_opt: ModelOptions, _queryContext: QueryContext): Promise<any> | void {
        this.updated_at = currentDateTime();
    }

    $beforeDelete(_queryContext: QueryContext): Promise<any> | void {
        this.updated_at = currentDateTime();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["title", "content", "status", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                floor_id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                equipment_id: { type: "string", format: "uuid" },
                title: { type: "string", maxLength: 255 },
                content: { type: "string" },
                status: { type: "string", maxLength: 20 },
                description: { type: "string" },
                files: { type: "object" },
                assign_to: { type: "string", format: "uuid" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
            },
        };
    }

    static get relationMappings() {
        return {
            equipment: {
                relation: Model.BelongsToOneRelation,
                modelClass: Equipment,
                join: {
                    from: "issues.equipment_id",
                    to: "equipment.id",
                },
            },
            assignee: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "issues.assign_to",
                    to: "users.id",
                },
            },
            house: {
                relation: Model.BelongsToOneRelation,
                modelClass: Houses,
                join: {
                    from: "issues.house_id",
                    to: "houses.id",
                },
            },
            floor: {
                relation: Model.BelongsToOneRelation,
                modelClass: HouseFloors,
                join: {
                    from: "issues.floor_id",
                    to: "house_floors.id",
                },
            },
            room: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "issues.room_id",
                    to: "rooms.id",
                },
            },
        };
    }
}

export default Issues;
