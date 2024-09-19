import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER contract_template_create
        AFTER INSERT
        ON contract_template
        FOR EACH ROW
        INSERT INTO contract_template_history (contract_template_id, house_id, name, content, is_active, action, created_by, created_at, updated_by, updated_at)
        VALUES (NEW.id, NEW.house_id, NEW.name, NEW.content, NEW.is_active, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER contract_template_create");
}
