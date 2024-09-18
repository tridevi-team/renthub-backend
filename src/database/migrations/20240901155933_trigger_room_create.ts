import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER room_create
        AFTER INSERT
        ON rooms
        FOR EACH ROW
        INSERT INTO room_history (room_id, floor_id, name, max_renters, room_area, price, description, status, action, created_by)
        VALUES (NEW.id, NEW.floor_id, NEW.name, NEW.max_renters, NEW.room_area, NEW.price, NEW.description, NEW.status, "CREATE", @created_by);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER room_create");
}
