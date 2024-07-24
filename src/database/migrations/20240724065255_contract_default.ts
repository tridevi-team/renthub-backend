import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("houses", (table) => {
        table.integer("contract_default").defaultTo(0).after("number_of_rooms");
    });
}

export async function down(knex: Knex): Promise<void> {}
