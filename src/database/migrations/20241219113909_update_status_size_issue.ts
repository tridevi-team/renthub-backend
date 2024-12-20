import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("issues", (table) => {
            table.string("status", 20).alter();
        })
        .alterTable("issue_history", (table) => {
            table.string("status", 20).alter();
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("issues", (table) => {
            table.string("status", 10).alter();
        })
        .alterTable("issue_history", (table) => {
            table.string("status", 10).alter();
        });
}
