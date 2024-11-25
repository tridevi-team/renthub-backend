import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("contract_template", (table) => {
            table.jsonb("landlord").after("content").nullable();
        })
        .alterTable("contract_template_history", (table) => {
            table.jsonb("landlord").after("content").nullable();
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER contract_template_create`);
        })
        .then(() => {
            return knex.raw(`
            CREATE TRIGGER contract_template_create
            AFTER INSERT
            ON contract_template
            FOR EACH ROW
            INSERT INTO contract_template_history (contract_template_id, house_id, name, content, landlord, is_active, action, created_by, created_at, updated_by, updated_at)
            VALUES (NEW.id, NEW.house_id, NEW.name, NEW.content, NEW.landlord, NEW.is_active, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);`);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER contract_template_update`);
        })
        .then(() => {
            return knex.raw(`
            CREATE TRIGGER contract_template_update
            BEFORE UPDATE
            ON contract_template
            FOR EACH ROW
            INSERT INTO contract_template_history (contract_template_id, house_id, name, content, landlord, is_active, action, created_by, created_at, updated_by, updated_at)
            VALUES (OLD.id, OLD.house_id, OLD.name, OLD.content, OLD.landlord, OLD.is_active, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER contract_template_delete`);
        })
        .then(() => {
            return knex.raw(`
            CREATE TRIGGER contract_template_delete
            BEFORE DELETE
            ON contract_template
            FOR EACH ROW
            INSERT INTO contract_template_history (contract_template_id, house_id, name, content, landlord, is_active, action, created_by, created_at, updated_by, updated_at)
            VALUES (OLD.id, OLD.house_id, OLD.name, OLD.content, OLD.landlord, OLD.is_active, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("contract_template", (table) => {
            table.dropColumn("landlord");
        })
        .alterTable("contract_template_history", (table) => {
            table.dropColumn("landlord");
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER contract_template_create`);
        })
        .then(() => {
            return knex.raw(`
            CREATE TRIGGER contract_template_create
            AFTER INSERT
            ON contract_template
            FOR EACH ROW
            INSERT INTO contract_template_history (contract_template_id, house_id, name, content, is_active, action, created_by, created_at, updated_by, updated_at)
            VALUES (NEW.id, NEW.house_id, NEW.name, NEW.content, NEW.is_active, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);`);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER contract_template_update`);
        })
        .then(() => {
            return knex.raw(`
            CREATE TRIGGER contract_template_update
            BEFORE UPDATE
            ON contract_template
            FOR EACH ROW
            INSERT INTO contract_template_history (contract_template_id, house_id, name, content, is_active, action, created_by, created_at, updated_by, updated_at)
            VALUES (OLD.id, OLD.house_id, OLD.name, OLD.content, OLD.is_active, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER contract_template_delete`);
        })
        .then(() => {
            return knex.raw(`
            CREATE TRIGGER contract_template_delete
            BEFORE DELETE
            ON contract_template
            FOR EACH ROW
            INSERT INTO contract_template_history (contract_template_id, house_id, name, content, is_active, action, created_by, created_at, updated_by, updated_at)
            VALUES (OLD.id, OLD.house_id, OLD.name, OLD.content, OLD.is_active, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
        });
}
