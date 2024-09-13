import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("renter_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("renter_id").references("id").inTable("renters").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("name").nullable();
        table.string("citizen_id").nullable();
        table.date("birthday").nullable();
        table.string("gender", 6).nullable(); // female/ male
        table.string("email").nullable();
        table.string("phone_number").nullable();
        table.string("address").nullable();
        table.boolean("temp_reg").nullable();
        table.date("move_in_date").nullable();
        table.boolean("represent").nullable();
        table.specificType("note", "text").nullable();
        table.string("otp", 6).nullable();
        table.datetime("expired_otp").nullable();
        table.string("action", 10).notNullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("renter_history");
}
