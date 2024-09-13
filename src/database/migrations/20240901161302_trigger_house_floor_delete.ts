import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER house_floor_delete
        BEFORE DELETE
        ON house_floors
        FOR EACH ROW
        INSERT INTO house_floor_history (floor_id, house_id, name, description, action, created_by)
        VALUES (OLD.id, OLD.house_id, OLD.name, OLD.description, "DELETE", @created_by);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER house_floor_delete");
}
