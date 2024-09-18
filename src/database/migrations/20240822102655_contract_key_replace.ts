import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("contract_key_replace", (table) => {
        table.string("key").primary();
        table.string("label").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("contract_key_replace");
}
