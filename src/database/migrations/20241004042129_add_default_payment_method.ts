import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("payment_methods", (table) => {
            table.boolean("is_default").defaultTo(false).after("description");
            table.string("bank_name").nullable().after("account_number");
        })
        .alterTable("payment_method_history", (table) => {
            table.boolean("is_default").nullable().after("description");
            table.string("bank_name").nullable().after("account_number");
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER payment_method_create`);
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER payment_method_create
                AFTER INSERT
                ON payment_methods
                FOR EACH ROW
                INSERT INTO payment_method_history (payment_method_id, house_id, name, account_number, bank_name, status, description, is_default, payos_client_id, payos_api_key, payos_checksum, action, created_by, created_at, updated_by, updated_at)
                VALUES (NEW.id, NEW.house_id, NEW.name, NEW.account_number, NEW.bank_name, NEW.status, NEW.description, NEW.is_default, NEW.payos_client_id, NEW.payos_api_key, NEW.payos_checksum, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);
            `);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER payment_method_update`);
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER payment_method_update
                BEFORE UPDATE
                ON payment_methods
                FOR EACH ROW
                INSERT INTO payment_method_history (payment_method_id, house_id, name, account_number, bank_name, status, description, is_default, payos_client_id, payos_api_key, payos_checksum, action, created_by, created_at, updated_by, updated_at)
                VALUES (OLD.id, OLD.house_id, OLD.name, OLD.account_number, OLD.bank_name, OLD.status, OLD.description, OLD.is_default, OLD.payos_client_id, OLD.payos_api_key, OLD.payos_checksum, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
            `);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER payment_method_delete`);
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER payment_method_delete
                BEFORE DELETE
                ON payment_methods
                FOR EACH ROW
                INSERT INTO payment_method_history (payment_method_id, house_id, name, account_number, bank_name, status, description, is_default, payos_client_id, payos_api_key, payos_checksum, action, created_by, created_at, updated_by, updated_at)
                VALUES (OLD.id, OLD.house_id, OLD.name, OLD.account_number, OLD.bank_name, OLD.status, OLD.description, OLD.is_default, OLD.payos_client_id, OLD.payos_api_key, OLD.payos_checksum, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
            `);
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("payment_methods", (table) => {
            table.dropColumn("is_default");
            table.dropColumn("bank_name");
        })
        .alterTable("payment_method_history", (table) => {
            table.dropColumn("is_default");
            table.dropColumn("bank_name");
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER payment_method_create`);
        })
        .then(() => {
            return knex.raw(`CREATE TRIGGER payment_method_create
                AFTER INSERT
                ON payment_methods
                FOR EACH ROW
                INSERT INTO payment_method_history (payment_method_id, house_id, name, account_number, status, description, payos_client_id, payos_api_key, payos_checksum, action, created_by, created_at, updated_by, updated_at)
                VALUES (NEW.id, NEW.house_id, NEW.name, NEW.account_number, NEW.status, NEW.description, NEW.payos_client_id, NEW.payos_api_key, NEW.payos_checksum, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);`);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER payment_method_update`);
        })
        .then(() => {
            return knex.raw(`CREATE TRIGGER payment_method_update
                BEFORE UPDATE
                ON payment_methods
                FOR EACH ROW
                INSERT INTO payment_method_history (payment_method_id, house_id, name, account_number, status, description, payos_client_id, payos_api_key, payos_checksum, action, created_by, created_at, updated_by, updated_at)
                VALUES (OLD.id, OLD.house_id, OLD.name, OLD.account_number, OLD.status, OLD.description, OLD.payos_client_id, OLD.payos_api_key, OLD.payos_checksum, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER payment_method_delete`);
        })
        .then(() => {
            return knex.raw(`CREATE TRIGGER payment_method_delete
                BEFORE DELETE
                ON payment_methods
                FOR EACH ROW
                INSERT INTO payment_method_history (payment_method_id, house_id, name, account_number, status, description, payos_client_id, payos_api_key, payos_checksum, action, created_by, created_at, updated_by, updated_at)
                VALUES (OLD.id, OLD.house_id, OLD.name, OLD.account_number, OLD.status, OLD.description, OLD.payos_client_id, OLD.payos_api_key, OLD.payos_checksum, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
        });
}
