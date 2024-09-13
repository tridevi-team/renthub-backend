import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER contract_template_create
        AFTER INSERT
        ON contract_template
        FOR EACH ROW
        INSERT INTO contract_template_history (contract_template_id, house_id, name, content, is_active, action, created_by)
        VALUES (NEW.id, NEW.house_id, NEW.name, NEW.content, NEW.is_active, "CREATE", @created_by);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER contract_template_create");
}
