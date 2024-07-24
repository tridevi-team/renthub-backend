import { table } from "console";
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("contract_key_replace", (table) => {
        table.integer("id").primary();
        table.string("key").notNullable();
        table.string("label").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {}
