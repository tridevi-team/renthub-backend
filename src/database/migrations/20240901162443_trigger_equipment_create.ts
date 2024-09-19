import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER equipment_create
        AFTER INSERT
        ON equipment
        FOR EACH ROW
        INSERT INTO equipment_history (equipment_id, house_id, room_id, code, name, status, shared_type, description, action, created_by, created_at, updated_by, updated_at)
        VALUES (NEW.id, NEW.house_id, NEW.room_id, NEW.code, NEW.name, NEW.status, NEW.shared_type, NEW.description, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER equipment_create");
}
