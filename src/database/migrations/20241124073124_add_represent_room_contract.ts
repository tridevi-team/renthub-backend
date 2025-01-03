import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("room_contracts", (table) => {
            table.string("deposit_status").nullable().defaultTo("PENDING").alter();
            table.jsonb("landlord").after("contract_id").notNullable();
            table.jsonb("renter").after("landlord").notNullable();
            table.text("renter_ids").after("renter").nullable();
            table.text("content", "longtext").after("renter_ids").notNullable();
            table.jsonb("room").after("rental_end_date").notNullable();
            table.jsonb("services").after("room").notNullable();
            table.jsonb("equipment").after("services").notNullable();
            table.string("approval_status", 40).after("status").defaultTo("PENDING");
            table.text("approval_note").after("approval_status").nullable();
            table.datetime("approval_date").after("approval_note").nullable();
            table.string("approval_by").references("id").inTable("renters").after("approval_date").nullable();
        })
        .alterTable("room_contract_history", (table) => {
            table.string("deposit_status").nullable().alter();
            table.jsonb("landlord").after("contract_id").nullable();
            table.jsonb("renter").after("landlord").nullable();
            table.text("renter_ids").after("renter").nullable();
            table.text("content", "longtext").after("renter_ids").notNullable();
            table.jsonb("room").after("rental_end_date").nullable();
            table.jsonb("services").after("room").nullable();
            table.jsonb("equipment").after("services").nullable();
            table.string("approval_status", 40).after("status");
            table.text("approval_note").after("approval_status").nullable();
            table.datetime("approval_date").after("approval_note").nullable();
            table.string("approval_by");
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
        INSERT INTO room_contract_history (room_contract_id, room_id, landlord, renter, renter_ids, content, contract_id, deposit_amount, deposit_status, deposit_date, deposit_refund, deposit_refund_date, rental_start_date, rental_end_date, room, services, equipment, status, approval_status, approval_note, approval_date, approval_by, action, created_by, created_at, updated_by, updated_at)
        VALUES (NEW.id, NEW.room_id, NEW.landlord, NEW.renter, NEW.renter_ids, NEW.content, NEW.contract_id, NEW.deposit_amount, NEW.deposit_status, NEW.deposit_date, NEW.deposit_refund, NEW.deposit_refund_date, NEW.rental_start_date, NEW.rental_end_date, NEW.room, NEW.services, NEW.equipment, NEW.status, NEW.approval_status, NEW.approval_note, NEW.approval_date, NEW.approval_by, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);`);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER room_contract_update`);
        })
        .then(() => {
            return knex.raw(`CREATE TRIGGER room_contract_update
        BEFORE UPDATE
        ON room_contracts
        FOR EACH ROW
        INSERT INTO room_contract_history (room_contract_id, room_id, landlord, renter, renter_ids, content, contract_id, deposit_amount, deposit_status, deposit_date, deposit_refund, deposit_refund_date, rental_start_date, rental_end_date, room, services, equipment, status, approval_status, approval_note, approval_date, approval_by, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.room_id, OLD.landlord, OLD.renter, OLD.renter_ids, OLD.content, OLD.contract_id, OLD.deposit_amount, OLD.deposit_status, OLD.deposit_date, OLD.deposit_refund, OLD.deposit_refund_date, OLD.rental_start_date, OLD.rental_end_date, OLD.room, OLD.services, OLD.equipment, OLD.status, OLD.approval_status, OLD.approval_note, OLD.approval_date, OLD.approval_by, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
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
        INSERT INTO room_contract_history (room_contract_id, room_id, landlord, renter, renter_ids, content, contract_id, deposit_amount, deposit_status, deposit_date, deposit_refund, deposit_refund_date, rental_start_date, rental_end_date, room, services, equipment, status, approval_status, approval_note, approval_date, approval_by, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.room_id, OLD.landlord, OLD.renter, OLD.renter_ids, OLD.content, OLD.contract_id, OLD.deposit_amount, OLD.deposit_status, OLD.deposit_date, OLD.deposit_refund, OLD.deposit_refund_date, OLD.rental_start_date, OLD.rental_end_date, OLD.room, OLD.services, OLD.equipment, OLD.status, OLD.approval_status, OLD.approval_note, OLD.approval_date, OLD.approval_by, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);`);
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("room_contracts", (table) => {
            table.dropForeign(["approval_by"]);
            table.string("deposit_status").notNullable().alter();
            table.dropColumn("landlord");
            table.dropColumn("renter");
            table.dropColumn("renter_ids");
            table.dropColumn("content");
            table.dropColumn("room");
            table.dropColumn("services");
            table.dropColumn("equipment");
            table.dropColumn("approval_status");
            table.dropColumn("approval_note");
            table.dropColumn("approval_date");
            table.dropColumn("approval_by");
        })
        .alterTable("room_contract_history", (table) => {
            table.string("deposit_status").notNullable().alter();
            table.dropColumn("landlord");
            table.dropColumn("renter");
            table.dropColumn("renter_ids");
            table.dropColumn("content");
            table.dropColumn("room");
            table.dropColumn("services");
            table.dropColumn("equipment");
            table.dropColumn("approval_status");
            table.dropColumn("approval_note");
            table.dropColumn("approval_date");
            table.dropColumn("approval_by");
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
