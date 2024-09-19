import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER role_delete
        AFTER DELETE
        ON roles
        FOR EACH ROW
        INSERT INTO role_history
        (role_id, house_id, name, permissions, description, status, action, created_by, created_at, updated_by, updated_at)
        VALUES
        (OLD.id, OLD.house_id, OLD.name, OLD.permissions, OLD.description, OLD.status, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER role_delete;");
}
