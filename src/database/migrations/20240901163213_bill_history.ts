import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("bill_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("bill_id").references("id").inTable("bills").onDelete("CASCADE");
        table.uuid("room_id").references("id").inTable("rooms").onDelete("CASCADE").onUpdate("CASCADE");
        table.uuid("payment_method_id").references("id").inTable("payment_methods").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("title").notNullable();
        table.integer("amount").notNullable();
        table.datetime("payment_date").notNullable();
        table.string("status", 10).notNullable().defaultTo("UNPAID");
        table.specificType("description", "text").nullable();
        table.string("action", 10).nullable(); // CREATE/ UPDATE/ DELETE
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("bill_history");
}
