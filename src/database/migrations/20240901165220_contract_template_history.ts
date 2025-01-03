import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("contract_template_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table
            .uuid("contract_template_id")
            .references("id")
            .inTable("contract_template")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table.uuid("house_id").references("id").inTable("houses").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("name").nullable();
        table.specificType("content", "longtext").nullable();
        table.boolean("is_active").nullable();
        table.string("action", 10).notNullable();
        table.uuid("created_by");
        table.datetime("created_at").nullable();
        table.uuid("updated_by");
        table.datetime("updated_at").nullable();
        table.datetime("action_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("contract_template_history");
}
