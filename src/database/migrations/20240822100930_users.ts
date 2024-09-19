import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.string("email", 50).notNullable().unique();
        table.string("password", 255).notNullable();
        table.string("full_name", 50).notNullable();
        table.string("gender", 6).nullable();
        table.string("phone_number", 11).nullable();
        table.string("address", 255).nullable();
        table.date("birthday").nullable();
        table.string("role", 10).defaultTo("user");
        table.string("type", 10).defaultTo("free");
        table.boolean("status").defaultTo(true);
        table.boolean("verify").defaultTo(false);
        table.boolean("first_login").defaultTo(true);
        table.datetime("created_at").defaultTo(knex.fn.now());
        table.uuid("updated_by").nullable();
        table.datetime("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users");
}
