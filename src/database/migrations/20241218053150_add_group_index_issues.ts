import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("issues", (table) => {
        table.index(["house_id", "floor_id", "room_id", "equipment_id"], "group_index");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("issues", (table) => {
        table.dropIndex([], "group_index");
    });
}
