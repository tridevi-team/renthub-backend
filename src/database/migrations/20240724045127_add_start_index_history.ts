import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("room_service_history", (table) => {
        table.integer("start_index").nullable().defaultTo(0);
    });
}

export async function down(knex: Knex): Promise<void> {}
