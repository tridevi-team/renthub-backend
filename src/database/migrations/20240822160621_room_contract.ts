import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("room_contracts", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.uuid("room_id").references("id").inTable("rooms").onDelete("CASCADE").onUpdate("CASCADE");
        table.uuid("contract_id").references("id").inTable("contract_template").onDelete("CASCADE").onUpdate("CASCADE");
        table.integer("deposit_amount").unsigned().defaultTo(0);
        table.integer("deposit_status").unsigned().defaultTo(0);
        table.datetime("deposit_date").defaultTo(knex.fn.now());
        table.integer("deposit_refund").unsigned().defaultTo(0);
        table.datetime("deposit_refund_date").defaultTo(knex.fn.now());
        table.datetime("rental_start_date").defaultTo(knex.fn.now());
        table.datetime("rental_end_date").defaultTo(knex.fn.now());
        table.string("status").defaultTo("ACTIVE");
        table.uuid("created_by").references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
        table.datetime("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("room_contracts");
}
