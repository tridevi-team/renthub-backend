import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER payment_method_delete
        BEFORE DELETE
        ON payment_methods
        FOR EACH ROW
        INSERT INTO payment_method_history (payment_method_id, house_id, name, account_number, status, description, payos_client_id, payos_api_key, payos_checksum, action, created_by)
        VALUES (OLD.id, OLD.house_id, OLD.name, OLD.account_number, OLD.status, OLD.description, OLD.payos_client_id, OLD.payos_api_key, OLD.payos_checksum, "DELETE", @created_by);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER payment_method_delete");
}
