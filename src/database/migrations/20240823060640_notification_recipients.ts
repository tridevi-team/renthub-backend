import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("notification_recipients", (table) => {
        table.uuid("notification_id").references("id").inTable("notifications").onDelete("CASCADE").onUpdate("CASCADE");
        table.uuid("recipient_id").references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("status", 10).notNullable().defaultTo("UNREAD");
        table.primary(["notification_id", "recipient_id"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("notification_recipients");
}
