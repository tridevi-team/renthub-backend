import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER payment_method_create
        AFTER INSERT
        ON payment_methods
        FOR EACH ROW
        INSERT INTO payment_method_history (payment_method_id, house_id, name, account_number, status, description, payos_client_id, payos_api_key, payos_checksum, action, created_by)
        VALUES (NEW.id, NEW.house_id, NEW.name, NEW.account_number, NEW.status, NEW.description, NEW.payos_client_id, NEW.payos_api_key, NEW.payos_checksum, "CREATE", @created_by);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER payment_method_create");
}
