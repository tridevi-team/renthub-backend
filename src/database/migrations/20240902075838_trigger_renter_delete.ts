import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER renter_delete
        BEFORE DELETE
        ON renters
        FOR EACH ROW
        INSERT INTO renter_history (renter_id, name, citizen_id, birthday, gender, email, phone_number, address, temp_reg, move_in_date, represent, note, otp, expired_otp, action, created_by)
        VALUES (OLD.id, OLD.name, OLD.citizen_id, OLD.birthday, OLD.gender, OLD.email, OLD.phone_number, OLD.address, OLD.temp_reg, OLD.move_in_date, OLD.represent, OLD.note, OLD.otp, OLD.expired_otp, "DELETE", OLD.created_by);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw(`DROP TRIGGER renter_delete`);
}
