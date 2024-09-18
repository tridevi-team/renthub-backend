import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable("room_history", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
            table.uuid("room_id").references("id").inTable("rooms").onDelete("CASCADE").nullable();
            table.uuid("floor_id").references("id").inTable("house_floors").onDelete("CASCADE").onUpdate("CASCADE");
            table.string("name").nullable();
            table.integer("max_renters").nullable();
            table.integer("room_area").unsigned().nullable();
            table.integer("price").unsigned().nullable();
            table.specificType("description", "text").nullable();
            table.string("status").nullable(); // AVAILABLE, OCCUPIED, MAINTENANCE
            table.string("action", 10).notNullable(); // ADD, UPDATE, DELETE
            table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
            table.datetime("created_at").defaultTo(knex.fn.now());
        })
        .createTable("room_service_history", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
            table.uuid("room_id").references("id").inTable("rooms").onDelete("CASCADE").nullable();
            table.uuid("service_id").references("id").inTable("services").onDelete("SET NULL").onUpdate("CASCADE");
            table.integer("quantity").unsigned().nullable();
            table.specificType("description", "text").nullable();
            table.integer("start_index").unsigned().nullable();
            table.string("action", 10).notNullable(); // ADD, UPDATE, DELETE
            table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
            table.datetime("created_at").defaultTo(knex.fn.now());
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("room_history").dropTable("room_service_history");
}
