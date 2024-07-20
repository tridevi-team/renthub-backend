import { table } from "console";
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("users", (table) => {
        table.dateTime("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {}
