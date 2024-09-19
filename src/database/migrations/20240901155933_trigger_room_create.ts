import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER room_create
        AFTER INSERT
        ON rooms
        FOR EACH ROW
        INSERT INTO room_history (room_id, floor_id, name, max_renters, room_area, price, description, status, action, created_by, created_at, updated_by, updated_at)
        VALUES (NEW.id, NEW.floor_id, NEW.name, NEW.max_renters, NEW.room_area, NEW.price, NEW.description, NEW.status, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER room_create");
}
