import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("notification_recipients", (table) => {
        table.dropForeign(["recipient_id"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("notification_recipients", (table) => {
        table.foreign("recipient_id").references("id").inTable("users");
    });
}
