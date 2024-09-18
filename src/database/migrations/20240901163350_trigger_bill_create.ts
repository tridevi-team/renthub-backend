import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER bill_create
        AFTER INSERT
        ON bills
        FOR EACH ROW
        INSERT INTO bill_history (bill_id, room_id, payment_method_id, title, amount, payment_date, status, description, action, created_by)
        VALUES (NEW.id, NEW.room_id, NEW.payment_method_id, NEW.title, NEW.amount, NEW.payment_date, NEW.status, NEW.description, "CREATE", @created_by);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER bill_create");
}
