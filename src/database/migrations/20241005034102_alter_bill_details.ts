import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("bill_details", (table) => {
        table.string("name").nullable().after("service_id");
        table
            .uuid("created_by")
            .references("id")
            .inTable("users")
            .onDelete("SET NULL")
            .onUpdate("CASCADE")
            .after("description");
        table.datetime("created_at").defaultTo(knex.fn.now()).after("created_by");
        table
            .uuid("updated_by")
            .references("id")
            .inTable("users")
            .onDelete("SET NULL")
            .onUpdate("CASCADE")
            .after("created_at");
        table.datetime("updated_at").defaultTo(knex.fn.now()).after("updated_by");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("bill_details", (table) => {
        table.dropForeign("created_by");
        table.dropForeign("updated_by");
        table.dropColumn("name");
        table.dropColumn("created_by");
        table.dropColumn("created_at");
        table.dropColumn("updated_by");
        table.dropColumn("updated_at");
    });
}
