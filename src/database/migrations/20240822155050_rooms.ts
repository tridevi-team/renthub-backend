import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("rooms", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("floor_id").references("id").inTable("house_floors").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("name").nullable();
        table.integer("max_renters").defaultTo(1);
        table.integer("room_area").unsigned().defaultTo(0);
        table.integer("price").unsigned().defaultTo(0);
        table.specificType("description", "text").nullable();
        table.string("status").defaultTo("AVAILABLE"); // AVAILABLE, OCCUPIED, MAINTENANCE
        table.uuid("created_by").references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("rooms");
}
