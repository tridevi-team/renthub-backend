import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER renter_delete
        BEFORE DELETE
        ON renters
        FOR EACH ROW
        INSERT INTO renter_history (renter_id, name, citizen_id, birthday, gender, email, phone_number, address, temp_reg, move_in_date, represent, note, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.name, OLD.citizen_id, OLD.birthday, OLD.gender, OLD.email, OLD.phone_number, OLD.address, OLD.temp_reg, OLD.move_in_date, OLD.represent, OLD.note, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw(`DROP TRIGGER renter_delete`);
}
