import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER house_delete
        BEFORE DELETE
        ON houses
        FOR EACH ROW
        INSERT INTO house_history (house_id, name, address, contract_default, description, collection_cycle, invoice_date, num_collect_days, status, action, created_by)
        VALUES (OLD.id, OLD.name, OLD.address, OLD.contract_default, OLD.description, OLD.collection_cycle, OLD.invoice_date, OLD.num_collect_days, OLD.status, "DELETE", @created_by);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER house_delete");
}
