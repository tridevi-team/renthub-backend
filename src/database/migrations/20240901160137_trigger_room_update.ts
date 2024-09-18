import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER room_update
        BEFORE UPDATE
        ON rooms
        FOR EACH ROW
        INSERT INTO room_history (room_id, floor_id, name, max_renters, room_area, price, description, status, action, created_by)
        VALUES (OLD.id, OLD.floor_id, OLD.name, OLD.max_renters, OLD.room_area, OLD.price, OLD.description, OLD.status, "UPDATE", @created_by);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER room_update");
}
