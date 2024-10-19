import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("renters", (table) => {
            table.string("room_id").references("id").inTable("rooms").onDelete("CASCADE").after("id");
        })
        .alterTable("renter_history", (table) => {
            table.string("room_id").nullable().after("renter_id");
        })
        .then(() =>
            knex.raw(`
            DROP TRIGGER IF EXISTS renter_create;
        `)
        )
        .then(() =>
            knex.raw(`
            CREATE TRIGGER renter_create
            AFTER INSERT ON renters
            FOR EACH ROW
            INSERT INTO renter_history (room_id, renter_id, name, citizen_id, birthday, gender, email, phone_number, address, temp_reg, move_in_date, represent, note, action, created_by, created_at, updated_by, updated_at)
            VALUES (NEW.room_id, NEW.id, NEW.name, NEW.citizen_id, NEW.birthday, NEW.gender, NEW.email, NEW.phone_number, NEW.address, NEW.temp_reg, NEW.move_in_date, NEW.represent, NEW.note, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);
        `)
        )
        .then(() =>
            knex.raw(`
            DROP TRIGGER IF EXISTS renter_update;
        `)
        )
        .then(() =>
            knex.raw(`
            CREATE TRIGGER renter_update
            BEFORE UPDATE ON renters
            FOR EACH ROW
            INSERT INTO renter_history (room_id, renter_id, name, citizen_id, birthday, gender, email, phone_number, address, temp_reg, move_in_date, represent, note, action, created_by, created_at, updated_by, updated_at)
            VALUES (OLD.room_id, OLD.id, OLD.name, OLD.citizen_id, OLD.birthday, OLD.gender, OLD.email, OLD.phone_number, OLD.address, OLD.temp_reg, OLD.move_in_date, OLD.represent, OLD.note, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
        `)
        )
        .then(() =>
            knex.raw(`
            DROP TRIGGER IF EXISTS renter_delete;
        `)
        )
        .then(() =>
            knex.raw(`
            CREATE TRIGGER renter_delete
            BEFORE DELETE ON renters
            FOR EACH ROW
            INSERT INTO renter_history (room_id, renter_id, name, citizen_id, birthday, gender, email, phone_number, address, temp_reg, move_in_date, represent, note, action, created_by, created_at, updated_by, updated_at)
            VALUES (OLD.room_id, OLD.id, OLD.name, OLD.citizen_id, OLD.birthday, OLD.gender, OLD.email, OLD.phone_number, OLD.address, OLD.temp_reg, OLD.move_in_date, OLD.represent, OLD.note, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
        `)
        );
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("renters", (table) => {
            table.dropForeign(["room_id"]);
            table.dropColumn("room_id");
        })
        .alterTable("renter_history", (table) => {
            table.dropColumn("room_id");
        })
        .then(() =>
            knex.raw(`
            DROP TRIGGER IF EXISTS renter_create;
        `)
        )
        .then(() =>
            knex.raw(`
            CREATE TRIGGER renter_create
            AFTER INSERT ON renters
            FOR EACH ROW
            INSERT INTO renter_history (renter_id, name, citizen_id, birthday, gender, email, phone_number, address, temp_reg, move_in_date, represent, note, action, created_by, created_at, updated_by, updated_at)
            VALUES (NEW.id, NEW.name, NEW.citizen_id, NEW.birthday, NEW.gender, NEW.email, NEW.phone_number, NEW.address, NEW.temp_reg, NEW.move_in_date, NEW.represent, NEW.note, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);
        `)
        )
        .then(() =>
            knex.raw(`
            DROP TRIGGER IF EXISTS renter_update;
        `)
        )
        .then(() =>
            knex.raw(`
            CREATE TRIGGER renter_update
            BEFORE UPDATE ON renters
            FOR EACH ROW
            INSERT INTO renter_history (renter_id, name, citizen_id, birthday, gender, email, phone_number, address, temp_reg, move_in_date, represent, note, action, created_by, created_at, updated_by, updated_at)
            VALUES (OLD.id, OLD.name, OLD.citizen_id, OLD.birthday, OLD.gender, OLD.email, OLD.phone_number, OLD.address, OLD.temp_reg, OLD.move_in_date, OLD.represent, OLD.note, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
        `)
        )
        .then(() =>
            knex.raw(`
            DROP TRIGGER IF EXISTS renter_delete;
        `)
        )
        .then(() =>
            knex.raw(`
            CREATE TRIGGER renter_delete
            BEFORE DELETE ON renters
            FOR EACH ROW
            INSERT INTO renter_history (renter_id, name, citizen_id, birthday, gender, email, phone_number, address, temp_reg, move_in_date, represent, note, action, created_by, created_at, updated_by, updated_at)
            VALUES (OLD.id, OLD.name, OLD.citizen_id, OLD.birthday, OLD.gender, OLD.email, OLD.phone_number, OLD.address, OLD.temp_reg, OLD.move_in_date, OLD.represent, OLD.note, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
        `)
        );
}
