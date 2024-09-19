import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER house_floor_create
        AFTER INSERT
        ON house_floors
        FOR EACH ROW
        INSERT INTO house_floor_history (floor_id, house_id, name, description, action, created_by, created_at, updated_by, updated_at)
        VALUES (NEW.id, NEW.house_id, NEW.name, NEW.description, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER house_floor_create");
}
