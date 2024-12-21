import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("room_contracts", (table) => {
        table.dropForeign(["room_id"]);
        table.dropForeign(["contract_id"]);

        table.foreign("room_id").references("id").inTable("rooms").onDelete("RESTRICT").onUpdate("CASCADE");
        table
            .foreign("contract_id")
            .references("id")
            .inTable("contract_template")
            .onDelete("SET NULL")
            .onUpdate("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("room_contracts", (table) => {
        table.dropForeign(["room_id"]);
        table.dropForeign(["contract_id"]);

        table.foreign("room_id").references("id").inTable("rooms").onDelete("CASCADE").onUpdate("CASCADE");
        table
            .foreign("contract_id")
            .references("id")
            .inTable("contract_template")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
    });
}
