import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("room_contract", (table) => {
        table.foreign("contract_template_id").references("id").inTable("contract_template");
    });
}

export async function down(knex: Knex): Promise<void> {}
