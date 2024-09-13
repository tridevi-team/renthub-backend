import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("house_floors", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("house_id").references("id").inTable("houses").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("name").notNullable();
        table.string("description").nullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("house_floors");
}
