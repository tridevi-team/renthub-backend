import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER role_create
        AFTER INSERT
        ON roles
        FOR EACH ROW
        INSERT INTO role_history
        (role_id, house_id, name, permissions, description, status, action, created_by, created_at, updated_by, updated_at)
        VALUES
        (NEW.id, NEW.house_id, NEW.name, NEW.permissions, NEW.description, NEW.status, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER role_create;");
}
