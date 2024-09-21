import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER house_create
        AFTER INSERT
        ON houses
        FOR EACH ROW
        INSERT INTO house_history (house_id, name, address, contract_default, description, collection_cycle, invoice_date, num_collect_days, status, action, created_by, created_at, updated_by, updated_at)
        VALUES (NEW.id, NEW.name, NEW.address, NEW.contract_default, NEW.description, NEW.collection_cycle, NEW.invoice_date, NEW.num_collect_days, NEW.status, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER house_create");
}
