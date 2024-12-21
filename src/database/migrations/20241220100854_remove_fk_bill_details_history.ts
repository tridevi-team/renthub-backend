import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("bill_details_history", (table) => {
        table.dropForeign(["service_id"]);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("bill_details_history", (table) => {
        table.foreign("service_id").references("id").inTable("services");
    });
}
