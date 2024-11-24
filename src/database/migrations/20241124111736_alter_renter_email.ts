import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("renters", (table) => {
        table.string("email").nullable().alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("renters", (table) => {
        table.string("email").notNullable().alter();
    });
}
