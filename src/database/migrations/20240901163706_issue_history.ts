import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("issue_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("issue_id").references("id").inTable("issues").onDelete("CASCADE").onUpdate("CASCADE");
        table.uuid("equipment_id").references("id").inTable("equipment").nullable();
        table.string("title").nullable();
        table.specificType("content", "text").nullable();
        table.string("status", 10).nullable(); // OPEN / CLOSED / IN_PROGRESS / REJECTED
        table.specificType("description", "text").nullable();
        table.json("files").nullable(); // include image, video, pdf, word, etc...
        table.uuid("assign_to").references("id").inTable("users").nullable().onDelete("SET NULL").onUpdate("CASCADE");
        table.string("action", 10).nullable(); // CREATE/ UPDATE/ DELETE
        table.uuid("created_by").references("id").inTable("renters").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
        table.uuid("updated_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("updated_at").defaultTo(knex.fn.now());
        table.datetime("action_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {}
