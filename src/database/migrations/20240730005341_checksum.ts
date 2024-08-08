import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("payment_methods", (table) => {
    table.text("checksum").nullable().alter();
    });
}


export async function down(knex: Knex): Promise<void> {
}
