import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER contract_template_delete
        BEFORE DELETE
        ON contract_template
        FOR EACH ROW
        INSERT INTO contract_template_history (contract_template_id, house_id, name, content, is_status, action, created_by)
        VALUES (OLD.id, OLD.house_id, OLD.name, OLD.content, OLD.is_active, "DELETE", @created_by);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER contract_template_delete");
}
