import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("notifications", function (table) {
        table.string("image_url", 255).nullable().after("content");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("notifications", function (table) {
        table.dropColumn("image_url");
    });
}
