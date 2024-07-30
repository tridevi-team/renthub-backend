import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("payment_methods", (table) => {
        table.string("account_number").notNullable().alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.table("payment_methods", (table) => {
        table.integer("account_number").notNullable().alter();
    });
}
