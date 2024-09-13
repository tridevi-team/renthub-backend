import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER issue_delete
        BEFORE DELETE
        ON issues
        FOR EACH ROW
        INSERT INTO issue_history (issue_id, equipment_id, title, content, status, description, files, assign_to, action, created_by)
        VALUES (OLD.id, OLD.equipment_id, OLD.title, OLD.content, OLD.status, OLD.description, OLD.files, OLD.assign_to, "DELETE", @created_by);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER issue_delete");
}
