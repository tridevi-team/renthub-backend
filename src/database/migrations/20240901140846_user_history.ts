import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("user_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.string("email", 50).notNullable();
        table.string("password", 255).notNullable();
        table.string("full_name", 50).notNullable();
        table.string("gender", 6).nullable();
        table.string("phone_number", 11).notNullable();
        table.string("address", 255).notNullable();
        table.date("birthday").nullable();
        table.string("role", 10);
        table.string("type", 10);
        table.boolean("status");
        table.boolean("verify");
        table.boolean("first_login");
        table.string("action", 10).notNullable(); // create, update, delete, rollback
        table.datetime("created_at").nullable();
        table.uuid("updated_by").nullable();
        table.datetime("updated_at").nullable();
        table.datetime("action_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("user_history");
}
