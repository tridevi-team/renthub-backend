import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER house_delete
        BEFORE DELETE
        ON houses
        FOR EACH ROW
        INSERT INTO house_history (house_id, name, address, contract_default, description, collection_cycle, invoice_date, num_collect_days, status, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.name, OLD.address, OLD.contract_default, OLD.description, OLD.collection_cycle, OLD.invoice_date, OLD.num_collect_days, OLD.status, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER house_delete");
}
