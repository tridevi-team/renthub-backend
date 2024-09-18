import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER service_delete
        BEFORE DELETE
        ON services
        FOR EACH ROW
        INSERT INTO service_history (service_id, house_id, name, unit_price, type, has_index, description, action, created_by)
        VALUES (OLD.id, OLD.house_id, OLD.name, OLD.unit_price, OLD.type, OLD.has_index, OLD.description, "DELETE", @created_by);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw(`DROP TRIGGER service_delete`);
}
