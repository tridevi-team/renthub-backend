import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER role_delete
        AFTER DELETE
        ON roles
        FOR EACH ROW
        INSERT INTO role_history
        (role_id, house_id, name, permissions, description, status, action, created_by)
        VALUES
        (OLD.id, OLD.house_id, OLD.name, OLD.permissions, OLD.description, OLD.status, "DELETE", @created_by);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER role_delete;");
}
