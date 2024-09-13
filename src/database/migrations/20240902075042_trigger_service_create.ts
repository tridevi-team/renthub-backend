import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER service_create
        AFTER INSERT
        ON services
        FOR EACH ROW
        INSERT INTO service_history (service_id, house_id, name, unit_price, type, has_index, description, action, created_by)
        VALUES (NEW.id, NEW.house_id, NEW.name, NEW.unit_price, NEW.type, NEW.has_index, NEW.description, "CREATE", @created_by);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw(`DROP TRIGGER service_create`);
}
