import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("house_floor_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("floor_id").references("id").inTable("house_floors").onDelete("CASCADE");
        table.uuid("house_id").references("id").inTable("houses").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("name").nullable();
        table.string("description").nullable();
        table.string("action", 10).notNullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at");
        table.uuid("updated_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("updated_at");
        table.datetime("action_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("house_floor_history");
}
