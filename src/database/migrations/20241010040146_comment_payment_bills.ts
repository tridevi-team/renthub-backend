import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("bills", (table) => {
        table
            .uuid("payment_method_id")
            .comment("If payment method is null, it indicates that the bill was paid in cash")
            .alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("bills", (table) => {
        table.uuid("payment_method_id").comment("Payment method used to pay the bill").alter().alter();
    });
}
