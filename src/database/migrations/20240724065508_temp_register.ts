import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("renters", (table) => {
        table.boolean("temporary_registration").defaultTo(false).after("license_plates");
        table.dateTime("move_in_date").after("temporary_registration");
    });
}

export async function down(knex: Knex): Promise<void> {}
