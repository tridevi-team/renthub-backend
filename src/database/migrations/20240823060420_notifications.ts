import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("notifications", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.string("title").notNullable();
        table.specificType("content", "text").notNullable();
        table.string("type", 10).notNullable().defaultTo("INFO");
        table.string("navigate_to").nullable();
        table.json("params").nullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("notifications");
}
