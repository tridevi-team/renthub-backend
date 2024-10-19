import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("room_contract_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table
            .uuid("room_contract_id")
            .references("id")
            .inTable("room_contracts")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table.uuid("room_id").references("id").inTable("rooms").onDelete("CASCADE").onUpdate("CASCADE");
        table.uuid("contract_id").references("id").inTable("contract_template").onDelete("CASCADE").onUpdate("CASCADE");
        table.integer("deposit_amount").unsigned().nullable();
        table.integer("deposit_status").unsigned().nullable();
        table.datetime("deposit_date").nullable();
        table.integer("deposit_refund").unsigned().nullable();
        table.datetime("deposit_refund_date").nullable();
        table.datetime("rental_start_date").nullable();
        table.datetime("rental_end_date").nullable();
        table.string("status").nullable();
        table.string("action", 10).notNullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("created_at").nullable();
        table.uuid("updated_by").references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
        table.datetime("updated_at").nullable();
        table.datetime("action_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("room_contract_history");
}
