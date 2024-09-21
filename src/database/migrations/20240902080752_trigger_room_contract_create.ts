import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER room_contract_create
        AFTER INSERT
        ON room_contracts
        FOR EACH ROW
        INSERT INTO room_contract_history (room_contract_id, room_id, contract_id, deposit_amount, deposit_status, deposit_date, deposit_refund, deposit_refund_date, rental_start_date, rental_end_date, status, action, created_by, created_at, updated_by, updated_at)
        VALUES (NEW.id, NEW.room_id, NEW.contract_id, NEW.deposit_amount, NEW.deposit_status, NEW.deposit_date, NEW.deposit_refund, NEW.deposit_refund_date, NEW.rental_start_date, NEW.rental_end_date, NEW.status, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw(`DROP TRIGGER room_contract_create`);
}
