import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("equipment_history", (table) => {
            table.uuid("floor_id").references("id").inTable("house_floors").nullable().after("house_id");
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER IF EXISTS equipment_create;`);
        })
        .then(() => {
            return knex.raw(`
            CREATE TRIGGER equipment_create
            AFTER INSERT
            ON equipment
            FOR EACH ROW
            INSERT INTO equipment_history (equipment_id, house_id, floor_id, room_id, code, name, status, shared_type, description, action, created_by, created_at, updated_by, updated_at)
            VALUES (NEW.id, NEW.house_id, NEW.floor_id, NEW.room_id, NEW.code, NEW.name, NEW.status, NEW.shared_type, NEW.description, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);
            `);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER IF EXISTS equipment_update;`);
        })
        .then(() => {
            return knex.raw(`
            CREATE TRIGGER equipment_update
            BEFORE UPDATE
            ON equipment
            FOR EACH ROW
            INSERT INTO equipment_history (equipment_id, house_id, floor_id, room_id, code, name, status, shared_type, description, action, created_by, created_at, updated_by, updated_at)
            VALUES (OLD.id, OLD.house_id, OLD.floor_id, OLD.room_id, OLD.code, OLD.name, OLD.status, OLD.shared_type, OLD.description, "UPDATE", OLD.created_by, OLD.created_at, NEW.updated_by, NEW.updated_at);
            `);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER IF EXISTS equipment_delete;`);
        })
        .then(() => {
            return knex.raw(`
            CREATE TRIGGER equipment_delete
            BEFORE DELETE
            ON equipment
            FOR EACH ROW
            INSERT INTO equipment_history (equipment_id, house_id, floor_id, room_id, code, name, status, shared_type, description, action, created_by, created_at, updated_by, updated_at)
            VALUES (OLD.id, OLD.house_id, OLD.floor_id, OLD.room_id, OLD.code, OLD.name, OLD.status, OLD.shared_type, OLD.description, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
            `);
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("equipment_history", (table) => {
            table.dropForeign(["floor_id"]);
            table.dropColumn("floor_id");
        })
        .then(() => {
            return knex.raw("DROP TRIGGER equipment_create");
        })
        .then(() => {
            return knex.raw(`CREATE TRIGGER equipment_create
                AFTER INSERT
                ON equipment
                FOR EACH ROW
                INSERT INTO equipment_history (equipment_id, house_id, room_id, code, name, status, shared_type, description, action, created_by, created_at, updated_by, updated_at)
                VALUES (NEW.id, NEW.house_id, NEW.room_id, NEW.code, NEW.name, NEW.status, NEW.shared_type, NEW.description, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);`);
        })
        .then(() => {
            return knex.raw("DROP TRIGGER equipment_update");
        })
        .then(() => {
            return knex.raw(`CREATE TRIGGER equipment_update
                BEFORE UPDATE
                ON equipment
                FOR EACH ROW
                INSERT INTO equipment_history (equipment_id, house_id, room_id, code, name, status, shared_type, description, action, created_by, created_at, updated_by, updated_at)
                VALUES (OLD.id, OLD.house_id, OLD.room_id, OLD.code, OLD.name, OLD.status, OLD.shared_type, OLD.description, "UPDATE", OLD.created_by, OLD.created_at, NEW.updated_by, NEW.updated_at);`);
        })
        .then(() => {
            return knex.raw("DROP TRIGGER equipment_delete");
        })
        .then(() => {
            return knex.raw(`CREATE TRIGGER equipment_delete
            BEFORE DELETE
            ON equipment
            FOR EACH ROW
            INSERT INTO equipment_history (equipment_id, house_id, room_id, code, name, status, shared_type, description, action, created_by, created_at, updated_by, updated_at)
            VALUES (OLD.id, OLD.house_id, OLD.room_id, OLD.code, OLD.name, OLD.status, OLD.shared_type, OLD.description, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
        });
}
