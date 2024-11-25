import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("room_contracts", (table) => {
            table.string("deposit_status").nullable().defaultTo("PENDING").alter();
            table.jsonb("landlord").after("contract_id").nullable();
            table.jsonb("renter").after("landlord").nullable();
            table.text("renter_ids").after("renter").nullable();
            table.jsonb("services").after("rental_end_date").nullable();
            table.jsonb("equipment").after("services").nullable();
        })
        .alterTable("room_contract_history", (table) => {
            table.string("deposit_status").nullable().alter();
            table.jsonb("landlord").after("contract_id").nullable();
            table.jsonb("renter").after("landlord").nullable();
            table.text("renter_ids").after("renter").nullable();
            table.jsonb("services").after("rental_end_date").nullable();
            table.jsonb("equipment").after("services").nullable();
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER room_contract_create`);
        })
        .then(() => {
            return knex.raw(`
        CREATE TRIGGER room_contract_create
        AFTER INSERT
        ON room_contracts
        FOR EACH ROW
        INSERT INTO room_contract_history (room_contract_id, room_id, landlord, renter, renter_ids, contract_id, deposit_amount, deposit_status, deposit_date, deposit_refund, deposit_refund_date, rental_start_date, rental_end_date, services, equipment, status, action, created_by, created_at, updated_by, updated_at)
        VALUES (NEW.id, NEW.room_id, NEW.landlord, NEW.renter, NEW.renter_ids, NEW.contract_id, NEW.deposit_amount, NEW.deposit_status, NEW.deposit_date, NEW.deposit_refund, NEW.deposit_refund_date, NEW.rental_start_date, NEW.rental_end_date, NEW.services, NEW.equipment, NEW.status, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);`);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER room_contract_update`);
        })
        .then(() => {
            return knex.raw(`CREATE TRIGGER room_contract_update
        BEFORE UPDATE
        ON room_contracts
        FOR EACH ROW
        INSERT INTO room_contract_history (room_contract_id, room_id, landlord, renter, renter_ids, contract_id, deposit_amount, deposit_status, deposit_date, deposit_refund, deposit_refund_date, rental_start_date, rental_end_date, services, equipment, status, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.room_id, OLD.landlord, OLD.renter, OLD.renter_ids, OLD.contract_id, OLD.deposit_amount, OLD.deposit_status, OLD.deposit_date, OLD.deposit_refund, OLD.deposit_refund_date, OLD.rental_start_date, OLD.rental_end_date, OLD.services, OLD.equipment, OLD.status, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER room_contract_delete`);
        })
        .then(() => {
            return knex.raw(`
        CREATE TRIGGER room_contract_delete
        BEFORE DELETE
        ON room_contracts
        FOR EACH ROW
        INSERT INTO room_contract_history (room_contract_id, room_id, landlord, renter, renter_ids, contract_id, deposit_amount, deposit_status, deposit_date, deposit_refund, deposit_refund_date, rental_start_date, rental_end_date, services, equipment, status, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.room_id, OLD.landlord, OLD.renter, OLD.renter_ids, OLD.contract_id, OLD.deposit_amount, OLD.deposit_status, OLD.deposit_date, OLD.deposit_refund, OLD.deposit_refund_date, OLD.rental_start_date, OLD.rental_end_date, OLD.services, OLD.equipment, OLD.status, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("room_contracts", (table) => {
            table.string("deposit_status").notNullable().alter();
            table.dropColumn("landlord");
            table.dropColumn("renter");
            table.dropColumn("renter_ids");
            table.dropColumn("services");
            table.dropColumn("equipment");
        })
        .alterTable("room_contract_history", (table) => {
            table.string("deposit_status").notNullable().alter();
            table.dropColumn("landlord");
            table.dropColumn("renter");
            table.dropColumn("renter_ids");
            table.dropColumn("services");
            table.dropColumn("equipment");
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER room_contract_create`);
        })
        .then(() => {
            return knex.raw(`
        CREATE TRIGGER room_contract_create
        AFTER INSERT
        ON room_contracts
        FOR EACH ROW
        INSERT INTO room_contract_history (room_contract_id, room_id, contract_id, deposit_amount, deposit_status, deposit_date, deposit_refund, deposit_refund_date, rental_start_date, rental_end_date, status, action, created_by, created_at, updated_by, updated_at)
        VALUES (NEW.id, NEW.room_id, NEW.contract_id, NEW.deposit_amount, NEW.deposit_status, NEW.deposit_date, NEW.deposit_refund, NEW.deposit_refund_date, NEW.rental_start_date, NEW.rental_end_date, NEW.status, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);`);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER room_contract_update`);
        })
        .then(() => {
            return knex.raw(`
        CREATE TRIGGER room_contract_update
        BEFORE UPDATE
        ON room_contracts
        FOR EACH ROW
        INSERT INTO room_contract_history (room_contract_id, room_id, contract_id, deposit_amount, deposit_status, deposit_date, deposit_refund, deposit_refund_date, rental_start_date, rental_end_date, status, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.room_id, OLD.contract_id, OLD.deposit_amount, OLD.deposit_status, OLD.deposit_date, OLD.deposit_refund, OLD.deposit_refund_date, OLD.rental_start_date, OLD.rental_end_date, OLD.status, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER room_contract_delete`);
        })
        .then(() => {
            return knex.raw(`
        CREATE TRIGGER room_contract_delete
        BEFORE DELETE
        ON room_contracts
        FOR EACH ROW
        INSERT INTO room_contract_history (room_contract_id, room_id, contract_id, deposit_amount, deposit_status, deposit_date, deposit_refund, deposit_refund_date, rental_start_date, rental_end_date, status, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.room_id, OLD.contract_id, OLD.deposit_amount, OLD.deposit_status, OLD.deposit_date, OLD.deposit_refund, OLD.deposit_refund_date, OLD.rental_start_date, OLD.rental_end_date, OLD.status, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
        });
}
