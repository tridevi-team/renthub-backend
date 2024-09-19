import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER equipment_update
        BEFORE UPDATE
        ON equipment
        FOR EACH ROW
        INSERT INTO equipment_history (equipment_id, house_id, room_id, code, name, status, shared_type, description, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.house_id, OLD.room_id, OLD.code, OLD.name, OLD.status, OLD.shared_type, OLD.description, "UPDATE", OLD.created_by, OLD.created_at, NEW.updated_by, NEW.updated_at);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER equipment_update");
}
