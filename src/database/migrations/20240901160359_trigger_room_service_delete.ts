import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER room_service_delete
        BEFORE DELETE
        ON room_services
        FOR EACH ROW
        INSERT INTO room_service_history (room_id, service_id, quantity, start_index, description, action, created_by)
        VALUES (OLD.room_id, OLD.service_id, OLD.quantity, OLD.start_index, OLD.description, "DELETE", @created_by);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER room_service_delete");
}
