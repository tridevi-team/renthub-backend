import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER contract_template_update
        BEFORE UPDATE
        ON contract_template
        FOR EACH ROW
        INSERT INTO contract_template_history (contract_template_id, house_id, name, content, is_active, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.house_id, OLD.name, OLD.content, OLD.is_active, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER contract_template_update");
}
