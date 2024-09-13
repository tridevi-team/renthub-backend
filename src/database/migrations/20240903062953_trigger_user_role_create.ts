import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER user_role_create
        AFTER INSERT
        ON user_roles
        FOR EACH ROW
        INSERT INTO user_role_history
        (user_role_id, user_id, house_id, role_id, action, created_by)
        VALUES
        (NEW.id, NEW.user_id, NEW.house_id, NEW.role_id, 'CREATE', @created_by);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER user_role_create");
}
