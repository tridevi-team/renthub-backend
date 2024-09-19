import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("payment_method_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("payment_method_id").references("id").inTable("payment_methods").onDelete("CASCADE");
        table.uuid("house_id").references("id").inTable("houses").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("name").nullable();
        table.string("account_number").notNullable();
        table.boolean("status").nullable();
        table.string("description").nullable();
        table.string("payos_client_id").nullable();
        table.string("payos_api_key").nullable();
        table.string("payos_checksum").nullable();
        table.string("action", 10).nullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").nullable();
        table.uuid("updated_by").references("id").inTable("users").nullable();
        table.datetime("updated_at").nullable();
        table.datetime("action_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("payment_method_history");
}
