import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("services", (table) => {
            table.string("type", 50).nullable().alter();
        })
        .alterTable("service_history", (table) => {
            table.string("type", 50).nullable().alter();
        })
        .raw(`DROP TRIGGER service_create`)
        .raw(
            `CREATE TRIGGER service_create
        AFTER INSERT
        ON services
        FOR EACH ROW
        INSERT INTO service_history (service_id, house_id, name, unit_price, type, description, action, created_by, created_at, updated_by, updated_at)
        VALUES (NEW.id, NEW.house_id, NEW.name, NEW.unit_price, NEW.type, NEW.description, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);
        `
        )
        .raw(`DROP TRIGGER service_update`)
        .raw(
            `CREATE TRIGGER service_update
        BEFORE UPDATE
        ON services
        FOR EACH ROW
        INSERT INTO service_history (service_id, house_id, name, unit_price, type, description, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.house_id, OLD.name, OLD.unit_price, OLD.type, OLD.description, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
        `
        )
        .raw(`DROP TRIGGER service_delete`).raw(`CREATE TRIGGER service_delete
        BEFORE DELETE
        ON services
        FOR EACH ROW
        INSERT INTO service_history (service_id, house_id, name, unit_price, type, description, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.house_id, OLD.name, OLD.unit_price, OLD.type, OLD.description, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
        `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("services", (table) => {
            table.string("type", 10).notNullable().alter();
        })
        .alterTable("service_history", (table) => {
            table.string("type", 10).notNullable().alter();
        })
        .raw(`DROP TRIGGER service_create`)
        .raw(
            `
            CREATE TRIGGER service_create
        AFTER INSERT
        ON services
        FOR EACH ROW
        INSERT INTO service_history (service_id, house_id, name, unit_price, type, has_index, description, action, created_by, created_at, updated_by, updated_at)
        VALUES (NEW.id, NEW.house_id, NEW.name, NEW.unit_price, NEW.type, NEW.has_index, NEW.description, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);
        `
        )
        .raw(`DROP TRIGGER service_update`)
        .raw(
            `CREATE TRIGGER service_update
        BEFORE UPDATE
        ON services
        FOR EACH ROW
        INSERT INTO service_history (service_id, house_id, name, unit_price, type, has_index, description, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.house_id, OLD.name, OLD.unit_price, OLD.type, OLD.has_index, OLD.description, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
        `
        )
        .raw(`DROP TRIGGER service_delete`).raw(`CREATE TRIGGER service_delete
        BEFORE DELETE
        ON services
        FOR EACH ROW
        INSERT INTO service_history (service_id, house_id, name, unit_price, type, has_index, description, action, created_by, created_at, updated_by, updated_at)
        VALUES (OLD.id, OLD.house_id, OLD.name, OLD.unit_price, OLD.type, OLD.has_index, OLD.description, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
        `);
}
