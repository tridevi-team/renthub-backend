import { RoomContracts, Rooms } from "@models";
import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import { Address } from "../interfaces";
import { currentDateTime } from "../utils/currentTime";

class Renters extends Model {
    id: string;
    room_id: string;
    name: string;
    citizen_id: string;
    birthday: string;
    gender: "male" | "female" | "other";
    email: string;
    phone_number: string;
    address: Address;
    temp_reg: boolean;
    move_in_date: string;
    represent: boolean;
    note: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    phoneNumber: string;
    roomId: string;
    createdBy: string;
    count: number;
    results: Renters[];

    static get tableName() {
        return "renters";
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
            required: ["name"],
            properties: {
                id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 255 },
                citizen_id: { type: "string", maxLength: 255 },
                birthday: { type: "string", format: "date" },
                gender: { type: "string", maxLength: 6 },
                email: { type: "string", maxLength: 255 },
                phone_number: { type: "string", maxLength: 255 },
                address: { type: "object" },
                temp_reg: { type: "boolean" },
                move_in_date: { type: "string", format: "date" },
                represent: { type: "boolean" },
                note: { type: "string" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
            },
        };
    }

    static get relationMappings() {
        return {
            room: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "renters.room_id",
                    to: "rooms.id",
                },
            },
            contract: {
                relation: Model.HasManyRelation,
                modelClass: RoomContracts,
                join: {
                    from: "renters.id",
                    to: "room_contracts.renter_id",
                },
            },
        };
    }

    static get modifiers() {
        return {
            represent(builder) {
                builder.where("represent", true);
            },
            houseAndFloor(builder) {
                builder
                    .select("renters.*", "house_floors.house_id", "house_floors.id as floor_id")
                    .join("rooms", "rooms.id", "renters.room_id")
                    .join("house_floors", "house_floors.id", "rooms.floor_id");
            },
            basicInfo(builder) {
                builder.select(
                    "id",
                    "name",
                    "phone_number",
                    "email",
                    "citizen_id",
                    "address",
                    "birthday",
                    "gender",
                    "temp_reg",
                    "move_in_date",
                    "represent",
                    "note"
                );
            },
        };
    }
}

export default Renters;
