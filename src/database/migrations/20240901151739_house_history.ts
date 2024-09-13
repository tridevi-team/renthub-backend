import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("house_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("house_id").references("id").inTable("houses").onDelete("CASCADE");
        table.string("name", 50).nullable();
        table.string("address", 255).nullable();
        table.integer("contract_default").nullable();
        table.specificType("description", "text").nullable();
        table.integer("collection_cycle").nullable();
        table.integer("invoice_date").nullable();
        table.integer("num_collect_days").nullable();
        table.boolean("status").nullable();
        table.string("action", 10).nullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("house_history");
}
