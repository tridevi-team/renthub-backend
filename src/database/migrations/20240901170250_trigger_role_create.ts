import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER role_create
        AFTER INSERT
        ON roles
        FOR EACH ROW
        INSERT INTO role_history
        (role_id, house_id, name, permissions, description, status, action, created_by)
        VALUES
        (NEW.id, NEW.house_id, NEW.name, NEW.permissions, NEW.description, NEW.status, "CREATE", @created_by);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER role_create;");
}
