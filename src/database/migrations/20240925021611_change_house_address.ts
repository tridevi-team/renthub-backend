import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Drop any existing constraints before altering the column
    return knex.schema
        .alterTable("houses", (table) => {
            table.dropColumn("address");
        })
        .then(() => {
            // Re-create the column with the new type
            return knex.schema.alterTable("houses", (table) => {
                table.jsonb("address").nullable().after("name");
            });
        })
        .then(() => {
            // Handle the house_history table
            return knex.schema.alterTable("house_history", (table) => {
                table.dropColumn("address");
            });
        })
        .then(() => {
            return knex.schema.alterTable("house_history", (table) => {
                table.jsonb("address").nullable().after("name");
            });
        });
}

export async function down(knex: Knex): Promise<void> {
    // Revert the changes by dropping the jsonb column and restoring the string column
    return knex.schema
        .alterTable("houses", (table) => {
            table.dropColumn("address");
        })
        .then(() => {
            return knex.schema.alterTable("houses", (table) => {
                table.string("address").notNullable().after("name");
            });
        })
        .then(() => {
            return knex.schema.alterTable("house_history", (table) => {
                table.dropColumn("address");
            });
        })
        .then(() => {
            return knex.schema.alterTable("house_history", (table) => {
                table.string("address").notNullable().after("name");
            });
        });
}
