import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER user_role_delete
        BEFORE DELETE
        ON user_roles
        FOR EACH ROW
        INSERT INTO user_role_history
        (user_role_id, user_id, house_id, role_id, action, created_by, created_at, updated_by, updated_at)
        VALUES
        (OLD.id, OLD.user_id, OLD.house_id, OLD.role_id, 'DELETE', OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER user_role_delete");
}
