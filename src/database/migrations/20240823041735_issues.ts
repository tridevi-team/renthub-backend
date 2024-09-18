import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("issues", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("equipment_id").references("id").inTable("equipment").nullable();
        table.string("title").nullable();
        table.specificType("content", "text").notNullable();
        table.string("status", 10).notNullable().defaultTo("OPEN"); // OPEN / CLOSED / IN_PROGRESS / REJECTED
        table.specificType("description", "text").nullable();
        table.json("files").nullable(); // include image, video, pdf, word, etc...
        table.uuid("assign_to").references("id").inTable("users").nullable().onDelete("SET NULL").onUpdate("CASCADE");
        table.uuid("created_by").references("id").inTable("renters").onDelete("CASCADE").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("issues");
}
