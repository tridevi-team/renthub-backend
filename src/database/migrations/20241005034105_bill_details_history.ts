import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("bill_details_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("bill_details_id").references("id").inTable("bill_details").onDelete("CASCADE").onUpdate("CASCADE");
        table.uuid("bill_id").references("id").inTable("bills").onDelete("CASCADE").onUpdate("CASCADE");
        table.uuid("service_id").references("id").inTable("services").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("name").nullable();
        table.integer("old_value").notNullable();
        table.integer("new_value").notNullable();
        table.integer("amount").notNullable();
        table.integer("unit_price").notNullable();
        table.integer("total_price").notNullable();
        table.specificType("description", "text").nullable();
        table.uuid("created_by").references("id").inTable("users");
        table.datetime("created_at");
        table.uuid("updated_by").references("id").inTable("users");
        table.datetime("updated_at");
        table.string("action").notNullable();
        table.datetime("action_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("bill_details_history");
}
