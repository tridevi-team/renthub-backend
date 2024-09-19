import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("contract_template", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("house_id").references("id").inTable("houses").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("name").notNullable();
        table.specificType("content", "text").nullable();
        table.boolean("is_active").defaultTo(true);
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
        table.uuid("updated_by").references("id").inTable("users");
<<<<<<< Updated upstream
        table.datetime("updated_at").defaultTo(knex.fn.now());
=======
        table.datetime("updated_at").nullable();
>>>>>>> Stashed changes
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("contract_template");
}
