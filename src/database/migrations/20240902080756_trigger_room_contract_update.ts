import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER room_contract_update
        BEFORE UPDATE
        ON room_contracts
        FOR EACH ROW
        INSERT INTO room_contract_history (room_contract_id, room_id, contract_id, deposit_amount, deposit_status, deposit_date, deposit_refund, deposit_refund_date, rental_start_date, rental_end_date, status, action, created_by)
        VALUES (OLD.id, OLD.room_id, OLD.contract_id, OLD.deposit_amount, OLD.deposit_status, OLD.deposit_date, OLD.deposit_refund, OLD.deposit_refund_date, OLD.rental_start_date, OLD.rental_end_date, OLD.status, "UPDATE", @created_by);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw(`DROP TRIGGER room_contract_update`);
}