import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER equipment_delete
        BEFORE DELETE
        ON equipment
        FOR EACH ROW
        INSERT INTO equipment_history (equipment_id, house_id, room_id, code, name, status, shared_type, description, action, created_by)
        VALUES (OLD.id, OLD.house_id, OLD.room_id, OLD.code, OLD.name, OLD.status, OLD.shared_type, OLD.description, "DELETE", @created_by);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER equipment_delete");
}
