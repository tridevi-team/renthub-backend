import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER user_role_delete
        BEFORE DELETE
        ON user_roles
        FOR EACH ROW
        INSERT INTO user_role_history
        (user_role_id, user_id, house_id, role_id, action, created_by)
        VALUES
        (OLD.id, OLD.user_id, OLD.house_id, OLD.role_id, 'DELETE', @created_by);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER user_role_delete");
}
