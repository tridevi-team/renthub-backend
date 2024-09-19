import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER renter_create
        AFTER INSERT
        ON renters
        FOR EACH ROW
        INSERT INTO renter_history (renter_id, name, citizen_id, birthday, gender, email, phone_number, address, temp_reg, move_in_date, represent, note, action, created_by, created_at, updated_by, updated_at)
        VALUES (NEW.id, NEW.name, NEW.citizen_id, NEW.birthday, NEW.gender, NEW.email, NEW.phone_number, NEW.address, NEW.temp_reg, NEW.move_in_date, NEW.represent, NEW.note, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw(`DROP TRIGGER renter_create`);
}
