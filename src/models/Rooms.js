"use strict";
const { Model } = require("objection");

class Rooms extends Model {
    static get tableName() {
        return "rooms";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["house_id", "name", "price", "created_by"],
            properties: {
                id: { type: "integer" },
                house_id: { type: "integer" },
                name: { type: "string", minLength: 1, maxLength: 50 },
                max_renters: { type: "integer", default: -1 },
                num_of_renters: { type: "integer", default: 0 },
                floor: { type: "integer" },
                price: { type: "number" },
                created_by: { type: "integer" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }

    static relationMappings() {
        const Users = require("./Users");
        const Houses = require("./Houses");
        const Services = require("./Services");
        const RoomServices = require("./RoomServices");
        const Renters = require("./Renters");
        const Equipment = require("./Equipment");
        const RoomImages = require("./RoomImages");

        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "rooms.created_by",
                    to: "users.id",
                },
            },

            houses: {
                relation: Model.BelongsToOneRelation,
                modelClass: Houses,
                join: {
                    from: "rooms.house_id",
                    to: "houses.id",
                },
            },

            services: {
                relation: Model.ManyToManyRelation,
                modelClass: Services,
                join: {
                    from: "rooms.id",
                    through: {
                        from: "room_services.room_id",
                        to: "room_services.service_id",
                    },
                    to: "services.id",
                },
            },

            room_services: {
                relation: Model.HasManyRelation,
                modelClass: RoomServices,
                join: {
                    from: "rooms.id",
                    to: "room_services.room_id",
                },
            },

            renters: {
                relation: Model.HasManyRelation,
                modelClass: Renters,
                join: {
                    from: "rooms.id",
                    to: "renters.room_id",
                },
            },

            equipment: {
                relation: Model.HasManyRelation,
                modelClass: Equipment,
                join: {
                    from: "rooms.id",
                    to: "equipment.room_id",
                },
            },

            room_images: {
                relation: Model.HasManyRelation,
                modelClass: RoomImages,
                join: {
                    from: "rooms.id",
                    to: "room_images.room_id",
                },
            },
        };
    }
}

module.exports = Rooms;
