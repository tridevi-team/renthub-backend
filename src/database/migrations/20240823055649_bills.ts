import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("bills", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("room_id").references("id").inTable("rooms").onDelete("CASCADE").onUpdate("CASCADE");
        table
            .uuid("payment_method_id")
            .references("id")
            .inTable("payment_methods")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table.string("title").notNullable();
        table.integer("amount").notNullable();
        table.datetime("payment_date").notNullable();
        table.string("status", 10).notNullable().defaultTo("UNPAID");
        table.specificType("description", "text").nullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
        table.uuid("updated_by").references("id").inTable("users").nullable();
        table.datetime("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("bills");
}
