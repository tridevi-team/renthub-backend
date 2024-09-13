import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("user_roles", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("user_id").references("id").inTable("users").notNullable();
        table.uuid("house_id").references("id").inTable("houses").notNullable();
        table.uuid("role_id").references("id").inTable("roles").notNullable();
        table.uuid("created_by").references("id").inTable("users").notNullable();
        table.datetime("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("user_roles");
}
