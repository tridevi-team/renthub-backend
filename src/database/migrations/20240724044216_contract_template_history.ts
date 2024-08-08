import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("contract_template_history", (table) => {
        table.increments("id").unsigned().primary();
        table.string("name").notNullable();
        table.text("content").notNullable();
        table.boolean("is_active").notNullable().defaultTo(true);
        table.integer("created_by").index().references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.dateTime("created_at").defaultTo(knex.fn.now());
        table.string("type").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {}
