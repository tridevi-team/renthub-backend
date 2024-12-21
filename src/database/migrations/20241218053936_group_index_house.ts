import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("houses", (table) => {
        table.index(["id", "name"], "group_index");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("houses", (table) => {
        table.dropIndex([], "group_index");
    });
}
