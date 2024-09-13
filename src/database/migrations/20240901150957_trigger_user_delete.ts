import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER user_delete
        BEFORE DELETE
        ON users
        FOR EACH ROW
        INSERT INTO user_history (
            user_id, email, password, full_name, phone_number, address, birthday, role, type, status, verify, first_login, code, action, created_by
        ) VALUES (
            OLD.id, OLD.email, OLD.password, OLD.full_name, OLD.phone_number, OLD.address, OLD.birthday, OLD.role, OLD.type, OLD.status, OLD.verify, OLD.first_login, OLD.code, 'UPDATE', @created_by
        );
    `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER user_delete");
}
