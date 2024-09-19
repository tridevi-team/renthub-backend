import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER room_service_create
        AFTER INSERT
        ON room_services
        FOR EACH ROW
        INSERT INTO room_service_history (room_id, service_id, quantity, start_index, description, action, created_by, created_at, updated_by, updated_at)
        VALUES (NEW.room_id, NEW.service_id, NEW.quantity, NEW.start_index, NEW.description, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER room_service_create");
}
