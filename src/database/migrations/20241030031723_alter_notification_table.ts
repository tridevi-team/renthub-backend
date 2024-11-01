import { NotificationType } from "../../enums";
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("notifications", (table) => {
        table.renameColumn("params", "data");
        table.dropColumn("navigate_to");
        table.string("type").defaultTo(NotificationType.SYSTEM).alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("notifications", (table) => {
        table.renameColumn("data", "params");
        table.string("navigate_to", 255).after("type");
        table.string("type").defaultTo("info").alter();
    });
}
