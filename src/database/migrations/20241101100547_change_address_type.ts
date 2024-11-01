import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("users", (table) => {
            table.dropColumn("address");
        })
        .alterTable("users", (table) => {
            table.jsonb("address").nullable().after("phone_number");
        })
        .alterTable("user_history", (table) => {
            table.dropColumn("address");
        })
        .alterTable("user_history", (table) => {
            table.jsonb("address").nullable().after("phone_number");
        })
        .alterTable("renters", (table) => {
            table.dropColumn("address");
        })
        .alterTable("renters", (table) => {
            table.jsonb("address").nullable().after("phone_number");
        })
        .alterTable("renter_history", (table) => {
            table.dropColumn("address");
        })
        .alterTable("renter_history", (table) => {
            table.jsonb("address").nullable().after("phone_number");
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("users", (table) => {
            table.string("address").alter().nullable();
        })
        .alterTable("user_history", (table) => {
            table.string("address").alter().nullable();
        })
        .alterTable("renters", (table) => {
            table.string("address").alter().nullable();
        })
        .alterTable("renter_history", (table) => {
            table.string("address").alter().nullable();
        });
}
