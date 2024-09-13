import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER issue_create
        AFTER INSERT
        ON issues
        FOR EACH ROW
        INSERT INTO issue_history (issue_id, equipment_id, title, content, status, description, files, assign_to, action, created_by)
        VALUES (NEW.id, NEW.equipment_id, NEW.title, NEW.content, NEW.status, NEW.description, NEW.files, NEW.assign_to, "CREATE", @created_by);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER issue_create");
}
