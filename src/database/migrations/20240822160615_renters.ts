import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("renters", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.string("name").notNullable();
        table.string("citizen_id").notNullable();
        table.date("birthday").nullable();
        table.string("gender", 6).nullable(); // female/ male
        table.string("email").notNullable().unique();
        table.string("phone_number").notNullable().unique();
        table.string("address").notNullable();
        table.boolean("temp_reg").defaultTo(false);
        table.date("move_in_date").notNullable();
        table.boolean("represent").defaultTo(false);
        table.specificType("note", "text").nullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
        table.uuid("updated_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("updated_at").defaultTo(knex.fn.now());
        table.unique(["citizen_id", "phone_number"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("renters");
}
