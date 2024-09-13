import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("houses", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.string("name", 50).notNullable();
        table.string("address", 255).notNullable();
        table.integer("contract_default").nullable();
        table.specificType("description", "text").nullable();
        table.integer("collection_cycle").defaultTo(1);
        table.integer("invoice_date").defaultTo(1);
        table.integer("num_collect_days").defaultTo(5);
        table.boolean("status").defaultTo(true);
        table.uuid("created_by").references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("houses");
}
