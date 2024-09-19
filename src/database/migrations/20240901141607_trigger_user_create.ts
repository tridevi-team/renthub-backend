import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER user_create
        AFTER INSERT
        ON users
        FOR EACH ROW
        INSERT INTO user_history (
            user_id, email, password, full_name, phone_number, address, birthday, role, type, status, verify, first_login, code, action, created_by, created_at, updated_by, updated_at
        ) VALUES (
            NEW.id, NEW.email, NEW.password, NEW.full_name, NEW.phone_number, NEW.address, NEW.birthday, NEW.role, NEW.type, NEW.status, NEW.verify, NEW.first_login, NEW.code, 'CREATE', NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at
        );
    `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER user_create");
}
