import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("equipment", (table) => {
        table.uuid("floor_id").references("id").inTable("house_floors").nullable().after("house_id");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("equipment", (table) => {
        table.dropForeign(["floor_id"]);
        table.dropColumn("floor_id");
    });
}
