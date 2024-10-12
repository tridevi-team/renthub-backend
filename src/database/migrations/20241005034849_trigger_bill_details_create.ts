import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER bill_details_create
        AFTER INSERT
        ON bill_details
        FOR EACH ROW
        INSERT INTO bill_details_history (bill_details_id, bill_id, service_id, name, old_value, new_value, amount, unit_price, total_price, description, created_by, created_at, updated_by, updated_at, action)
        VALUES (NEW.id, NEW.bill_id, NEW.service_id, NEW.name, NEW.old_value, NEW.new_value, NEW.amount, NEW.unit_price, NEW.total_price, NEW.description, NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at, "CREATE");
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER bill_details_create");
}
