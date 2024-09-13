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
        table.string("otp", 6).nullable();
        table.datetime("expired_otp").nullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("renters");
}
