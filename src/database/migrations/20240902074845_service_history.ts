import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("service_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("service_id").references("id").inTable("services").onDelete("CASCADE");
        table.uuid("house_id").references("id").inTable("houses").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("name").nullable();
        table.integer("unit_price").unsigned().nullable();
        table.string("type", 10).nullable();
        table.boolean("has_index").nullable;
        table.specificType("description", "text").nullable();
        table.string("action", 10).notNullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
        table.uuid("updated_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("service_history");
}
