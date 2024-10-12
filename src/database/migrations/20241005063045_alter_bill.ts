import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("bills", (table) => {
            table.jsonb("date").after("payment_date");
            table.jsonb("payos_request").after("date");
            table.jsonb("payos_response").after("payos_request");
            // alter amount and payment date is null
            table.integer("amount").nullable().alter();
            table.datetime("payment_date").nullable().alter();
        })
        .alterTable("bill_history", (table) => {
            table.jsonb("date").after("payment_date");
            table.jsonb("payos_request").after("date");
            table.jsonb("payos_response").after("payos_request");
            table.integer("amount").nullable().alter();
            table.datetime("payment_date").nullable().alter();
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER IF EXISTS bill_create;`);
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER bill_create
                AFTER INSERT
                ON bills
                FOR EACH ROW
                INSERT INTO bill_history (bill_id, room_id, payment_method_id, title, amount, payment_date, date, payos_request, payos_response, status, description, action, created_by, created_at, updated_by, updated_at)
                VALUES (NEW.id, NEW.room_id, NEW.payment_method_id, NEW.title, NEW.amount, NEW.payment_date, NEW.date, NEW.payos_request, NEW.payos_response, NEW.status, NEW.description, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);
                `);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER IF EXISTS bill_update;`);
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER bill_update
                AFTER UPDATE
                ON bills
                FOR EACH ROW
                INSERT INTO bill_history (bill_id, room_id, payment_method_id, title, amount, payment_date, date, payos_request, payos_response, status, description, action, created_by, created_at, updated_by, updated_at)
                VALUES (OLD.id, OLD.room_id, OLD.payment_method_id, OLD.title, OLD.amount, OLD.payment_date, OLD.date, OLD.payos_request, OLD.payos_response, OLD.status, OLD.description, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
                `);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER IF EXISTS bill_delete;`);
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER bill_delete
                BEFORE DELETE
                ON bills
                FOR EACH ROW
                INSERT INTO bill_history (bill_id, room_id, payment_method_id, title, amount, payment_date, date, payos_request, payos_response, status, description, action, created_by, created_at, updated_by, updated_at)
                VALUES (OLD.id, OLD.room_id, OLD.payment_method_id, OLD.title, OLD.amount, OLD.payment_date, OLD.date, OLD.payos_request, OLD.payos_response, OLD.status, OLD.description, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
                `);
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("bills", (table) => {
            table.dropColumn("date");
            table.dropColumn("payos_request");
            table.dropColumn("payos_response");
        })
        .alterTable("bill_history", (table) => {
            table.dropColumn("date");
            table.dropColumn("payos_request");
            table.dropColumn("payos_response");
        })
        .then(() => {
            return knex.raw("DROP TRIGGER bill_create");
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER bill_create
                AFTER INSERT
                ON bills
                FOR EACH ROW
                INSERT INTO bill_history (bill_id, room_id, payment_method_id, title, amount, payment_date, status, description, action, created_by, created_at, updated_by, updated_at)
                VALUES (NEW.id, NEW.room_id, NEW.payment_method_id, NEW.title, NEW.amount, NEW.payment_date, NEW.status, NEW.description, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at)`);
        })
        .then(() => {
            return knex.raw("DROP TRIGGER bill_update");
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER bill_update
                AFTER UPDATE
                ON bills
                FOR EACH ROW
                INSERT INTO bill_history (bill_id, room_id, payment_method_id, title, amount, payment_date, status, description, action, created_by, created_at, updated_by, updated_at)
                VALUES (OLD.id, OLD.room_id, OLD.payment_method_id, OLD.title, OLD.amount, OLD.payment_date, OLD.status, OLD.description, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at)`);
        })
        .then(() => {
            return knex.raw("DROP TRIGGER bill_delete");
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER bill_delete
                BEFORE DELETE
                ON bills
                FOR EACH ROW
                INSERT INTO bill_history (bill_id, room_id, payment_method_id, title, amount, payment_date, status, description, action, created_by, created_at, updated_by, updated_at)
                VALUES (OLD.id, OLD.room_id, OLD.payment_method_id, OLD.title, OLD.amount, OLD.payment_date, OLD.status, OLD.description, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at)`);
        })
        .catch((err) => {
            console.log(err);
        });
}
