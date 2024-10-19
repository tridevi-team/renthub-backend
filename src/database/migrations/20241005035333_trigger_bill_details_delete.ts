import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TRIGGER bill_details_delete
        BEFORE DELETE
        ON bill_details
        FOR EACH ROW
        INSERT INTO bill_details_history (bill_details_id, bill_id, service_id, name, old_value, new_value, amount, unit_price, total_price, description, created_by, created_at, updated_by, updated_at, action)
        VALUES (OLD.id, OLD.bill_id, OLD.service_id, OLD.name, OLD.old_value, OLD.new_value, OLD.amount, OLD.unit_price, OLD.total_price, OLD.description, OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at, "DELETE");`);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw("DROP TRIGGER bill_details_delete");
}
