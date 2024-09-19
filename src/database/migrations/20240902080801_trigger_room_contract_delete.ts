import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER room_contract_delete
        BEFORE DELETE
        ON room_contracts
        FOR EACH ROW
        INSERT INTO room_contract_history (room_contract_id, room_id, contract_id, deposit_amount, deposit_status, deposit_date, deposit_refund, deposit_refund_date, rental_start_date, rental_end_date, status, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.room_id, OLD.contract_id, OLD.deposit_amount, OLD.deposit_status, OLD.deposit_date, OLD.deposit_refund, OLD.deposit_refund_date, OLD.rental_start_date, OLD.rental_end_date, OLD.status, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw(`DROP TRIGGER room_contract_delete`);
}
