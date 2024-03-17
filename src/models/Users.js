"use strict";
const { Model } = require("objection");

class Users extends Model {
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
                birthday: { type: "date" },
                role: { type: "string", minLength: 1, maxLength: 10 },
                type: { type: "string", minLength: 1, maxLength: 10 },
                status: { type: "boolean" },
            },
        };
    }

    static relationMappings() {
        const Houses = require("./Houses");
        const HousePermissions = require("./HousePermissions");
        const Rooms = require("./Rooms");
        const Bills = require("./Bills");
        const Renters = require("./Renters");
        const Services = require("./Services");
        const Equipments = require("./Equipments");
        const RoomServices = require("./RoomServices");
        const RoomImages = require("./RoomImages");

        return {
            houses: {
                relation: Model.HasManyRelation,
                modelClass: Houses,
                join: {
                    from: "users.id",
                    to: "houses.user_id",
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

            rooms: {
                relation: Model.HasManyRelation,
                modelClass: Rooms,
                join: {
                    from: "users.id",
                    to: "rooms.created_by",
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

            equipments: {
                relation: Model.HasManyRelation,
                modelClass: Equipments,
                join: {
                    from: "users.id",
                    to: "equipments.created_by",
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

            room_images: {
                relation: Model.HasManyRelation,
                modelClass: RoomImages,
                join: {
                    from: "users.id",
                    to: "room_images.created_by",
                },
            },
        };
    }
}

module.exports = Users;