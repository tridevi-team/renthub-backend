"use strict";
import { Model } from "objection";
import {
    Houses,
    HousePermissions,
    Rooms,
    Bills,
    Renters,
    Services,
    Equipment,
    RoomServices,
    RoomImages,
    UserHistory,
    BillHistory,
    EquipmentHistory,
    HouseLeaseContract,
    HouseLeaseContractHistory,
    HousePermissionHistory,
    PaymentMethods,
    PaymentMethodHistory,
    RoomHistory,
    RoomServiceHistory,
    ServiceHistory,
    HouseHistory,
} from ".";
import { accountTypes, accountRoles } from "../enum/Users";

class Users extends Model {
    id: Number;
    password: String;
    email: String;
    phone_number: String;
    full_name: String;
    birthday: Date;
    role: String;
    type: String;
    status: Boolean;
    verify: Boolean;
    code: Number;

    static get tableName() {
        return "users";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["email", "password", "full_name"],
            properties: {
                id: { type: "integer" },
                password: { type: "string", minLength: 1, maxLength: 250 },
                email: { type: "string", minLength: 1, maxLength: 50 },
                phone_number: { type: "string", minLength: 1, maxLength: 11 },
                full_name: { type: "string", minLength: 1, maxLength: 50 },
                birthday: { type: "string", format: "date" },
                role: { type: "string", minLength: 1, maxLength: 10, default: accountRoles.USER },
                type: { type: "string", minLength: 1, maxLength: 10, default: accountTypes.FREE },
                status: { type: "boolean", default: true },
                verify: { type: "boolean", default: false },
                code: { type: "integer", default: -1 },
            },
        };
    }

    static relationMappings() {
        return {
            houses: {
                relation: Model.HasManyRelation,
                modelClass: Houses,
                join: {
                    from: "users.id",
                    to: "houses.created_by",
                },
            },

            house_history: {
                relation: Model.HasManyRelation,
                modelClass: HouseHistory,
                join: {
                    from: "users.id",
                    to: "house_history.created_by",
                },
            },

            house_lease_contracts: {
                relation: Model.HasManyRelation,
                modelClass: HouseLeaseContract,
                join: {
                    from: "users.id",
                    to: "house_lease_contract.created_by",
                },
            },

            house_lease_contract_history: {
                relation: Model.HasManyRelation,
                modelClass: HouseLeaseContractHistory,
                join: {
                    from: "users.id",
                    to: "house_lease_contract_history.created_by",
                },
            },

            house_permissions: {
                relation: Model.HasManyRelation,
                modelClass: HousePermissions,
                join: {
                    from: "users.id",
                    to: "house_permissions.user_id",
                },
            },

            house_permission_history: {
                relation: Model.HasManyRelation,
                modelClass: HousePermissionHistory,
                join: {
                    from: "users.id",
                    to: "house_permission_history.created_by",
                },
            },

            rooms: {
                relation: Model.HasManyRelation,
                modelClass: Rooms,
                join: {
                    from: "users.id",
                    to: "rooms.created_by",
                },
            },

            room_history: {
                relation: Model.HasManyRelation,
                modelClass: RoomHistory,
                join: {
                    from: "users.id",
                    to: "room_history.created_by",
                },
            },

            bills: {
                relation: Model.HasManyRelation,
                modelClass: Bills,
                join: {
                    from: "users.id",
                    to: "bills.created_by",
                },
            },

            bill_history: {
                relation: Model.HasManyRelation,
                modelClass: BillHistory,
                join: {
                    from: "users.id",
                    to: "bill_history.created_by",
                },
            },

            payment_methods: {
                relation: Model.HasManyRelation,
                modelClass: PaymentMethods,
                join: {
                    from: "users.id",
                    to: "payment_methods.created_by",
                },
            },

            payment_method_history: {
                relation: Model.HasManyRelation,
                modelClass: PaymentMethodHistory,
                join: {
                    from: "users.id",
                    to: "payment_method_history.created_by",
                },
            },

            equipment: {
                relation: Model.HasManyRelation,
                modelClass: Equipment,
                join: {
                    from: "users.id",
                    to: "equipment.created_by",
                },
            },

            equipment_history: {
                relation: Model.HasManyRelation,
                modelClass: EquipmentHistory,
                join: {
                    from: "users.id",
                    to: "equipment_history.created_by",
                },
            },

            renters: {
                relation: Model.HasManyRelation,
                modelClass: Renters,
                join: {
                    from: "users.id",
                    to: "renters.created_by",
                },
            },

            services: {
                relation: Model.HasManyRelation,
                modelClass: Services,
                join: {
                    from: "users.id",
                    to: "services.created_by",
                },
            },

            service_history: {
                relation: Model.HasManyRelation,
                modelClass: ServiceHistory,
                join: {
                    from: "users.id",
                    to: "service_history.created_by",
                },
            },

            room_services: {
                relation: Model.HasManyRelation,
                modelClass: RoomServices,
                join: {
                    from: "users.id",
                    to: "room_services.created_by",
                },
            },

            room_service_history: {
                relation: Model.HasManyRelation,
                modelClass: RoomServiceHistory,
                join: {
                    from: "users.id",
                    to: "room_service_history.created_by",
                },
            },

            room_images: {
                relation: Model.HasManyRelation,
                modelClass: RoomImages,
                join: {
                    from: "users.id",
                    to: "room_images.created_by",
                },
            },

            user_history: {
                relation: Model.HasManyRelation,
                modelClass: UserHistory,
                join: {
                    from: "users.id",
                    to: "user_history.user_id",
                },
            },
        };
    }
}

export default Users;
