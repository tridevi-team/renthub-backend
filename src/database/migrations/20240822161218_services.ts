import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("services", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("house_id").references("id").inTable("houses").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("name").notNullable();
        table.integer("unit_price").unsigned().defaultTo(0);
        table.string("type", 50).nullable();
        table.boolean("has_index").defaultTo(false);
        table.specificType("description", "text").nullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
        table.uuid("updated_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("services");
}
