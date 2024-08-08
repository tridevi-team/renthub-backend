import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user_history", (table) => {
        table.boolean("first_login").defaultTo(false);
    });
}

export async function down(knex: Knex): Promise<void> {}
