import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("equipment_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("equipment_id").references("id").inTable("equipment").onDelete("CASCADE").onUpdate("CASCADE");
        table.uuid("house_id").references("id").inTable("houses").onDelete("CASCADE").onUpdate("CASCADE");
        table.uuid("room_id").references("id").inTable("rooms").onDelete("CASCADE").onUpdate("CASCADE").nullable();
        table.string("code").nullable();
        table.string("name").nullable();
        table.string("status").nullable(); // NORMAL/ MAINTENANCE/ BROKEN / LOST / DISPOSED
        table.string("shared_type").nullable(); // HOUSE/ ROOM
        table.specificType("description", "text").nullable();
        table.string("action", 10).nullable(); // CREATE/ UPDATE/ DELETE
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("equipment_history");
}
