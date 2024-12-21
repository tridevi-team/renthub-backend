import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("services", (table) => {
        table.dropColumn("has_index");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("services", (table) => {
        table.boolean("has_index").defaultTo(false).after("name");
    });
}
