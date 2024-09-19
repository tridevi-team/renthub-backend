import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER issue_create
        AFTER INSERT
        ON issues
        FOR EACH ROW
        INSERT INTO issue_history (issue_id, equipment_id, title, content, status, description, files, assign_to, action, created_by, created_at, updated_by, updated_at)
        VALUES (NEW.id, NEW.equipment_id, NEW.title, NEW.content, NEW.status, NEW.description, NEW.files, NEW.assign_to, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER issue_create");
}
