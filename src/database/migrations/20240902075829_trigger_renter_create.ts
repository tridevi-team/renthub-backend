import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER renter_create
        AFTER INSERT
        ON renters
        FOR EACH ROW
        INSERT INTO renter_history (renter_id, name, citizen_id, birthday, gender, email, phone_number, address, temp_reg, move_in_date, represent, note, otp, expired_otp, action, created_by)
        VALUES (NEW.id, NEW.name, NEW.citizen_id, NEW.birthday, NEW.gender, NEW.email, NEW.phone_number, NEW.address, NEW.temp_reg, NEW.move_in_date, NEW.represent, NEW.note, NEW.otp, NEW.expired_otp, "CREATE", NEW.created_by);`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw(`DROP TRIGGER renter_create`);
}
