import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER bill_delete
        BEFORE DELETE
        ON bills
        FOR EACH ROW
        INSERT INTO bill_history (bill_id, room_id, payment_method_id, title, amount, payment_date, status, description, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.room_id, OLD.payment_method_id, OLD.title, OLD.amount, OLD.payment_date, OLD.status, OLD.description, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER bill_delete");
}
