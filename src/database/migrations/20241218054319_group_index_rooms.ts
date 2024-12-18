import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("rooms", (table) => {
        table.index(["id", "floor_id"], "group_index");
        table.index(["id", "name", "price"], "group_index_price");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("rooms", (table) => {
        table.dropIndex([], "group_index");
        table.dropIndex([], "group_index_price");
    });
}
