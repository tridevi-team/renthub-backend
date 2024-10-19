import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("bill_details", (table) => {
        table.string("old_value").nullable().defaultTo(0).comment("Old value of the bill detail").alter();
        table.string("new_value").nullable().defaultTo(0).comment("New value of the bill detail").alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("bill_details", (table) => {
        table.string("old_value").notNullable().alter();
        table.string("new_value").notNullable().alter();
    });
}
