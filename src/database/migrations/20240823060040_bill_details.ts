import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("bill_details", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("bill_id").references("id").inTable("bills").onDelete("CASCADE").onUpdate("CASCADE");
        table.uuid("service_id").references("id").inTable("services").onDelete("CASCADE").onUpdate("CASCADE");
        table.integer("old_value").notNullable();
        table.integer("new_value").notNullable();
        table.integer("amount").notNullable();
        table.integer("unit_price").notNullable();
        table.integer("total_price").notNullable();
        table.specificType("description", "text").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("bill_details");
}
