import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("equipment", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("house_id").references("id").inTable("houses").onDelete("CASCADE").onUpdate("CASCADE");
        table.uuid("room_id").references("id").inTable("rooms").onDelete("CASCADE").onUpdate("CASCADE").nullable();
        table.string("code").notNullable().unique();
        table.string("name").notNullable();
        table.string("status").defaultTo("NORMAL"); // NORMAL/ MAINTENANCE/ BROKEN / LOST / DISPOSED
        table.string("shared_type").defaultTo("HOUSE"); // HOUSE/ ROOM
        table.specificType("description", "text").nullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("equipment");
}
