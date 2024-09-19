import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("room_services", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("room_id").references("id").inTable("rooms").onDelete("CASCADE").onUpdate("CASCADE");
        table.uuid("service_id").references("id").inTable("services").onDelete("CASCADE").onUpdate("CASCADE");
        table.integer("quantity").unsigned().defaultTo(1);
        table.integer("start_index").unsigned().nullable();
        table.specificType("description", "text").nullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
        table.uuid("updated_by").references("id").inTable("users");
        table.datetime("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("room_services");
}
