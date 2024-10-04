import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("issues", (table) => {
            table
                .uuid("house_id")
                .references("id")
                .inTable("houses")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .after("id");
            table
                .uuid("floor_id")
                .references("id")
                .inTable("house_floors")
                .nullable()
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .after("house_id");
            table
                .uuid("room_id")
                .references("id")
                .inTable("rooms")
                .nullable()
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .after("floor_id");
        })
        .alterTable("issue_history", (table) => {
            table
                .uuid("house_id")
                .references("id")
                .inTable("houses")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .after("issue_id");
            table
                .uuid("floor_id")
                .references("id")
                .inTable("house_floors")
                .nullable()
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .after("issue_id");
            table
                .uuid("room_id")
                .references("id")
                .inTable("rooms")
                .nullable()
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .after("floor_id");
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER issue_create;`);
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER issue_create
                AFTER INSERT
                ON issues
                FOR EACH ROW
                INSERT INTO issue_history (issue_id, house_id, equipment_id, room_id, floor_id, title, content, status, description, files, assign_to, action, created_by, created_at, updated_by, updated_at)
                VALUES (NEW.id, NEW.house_id, NEW.equipment_id, NEW.room_id, NEW.floor_id, NEW.title, NEW.content, NEW.status, NEW.description, NEW.files, NEW.assign_to, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);
                `);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER issue_update;`);
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER issue_update
                BEFORE UPDATE
                ON issues
                FOR EACH ROW
                INSERT INTO issue_history (issue_id, house_id, equipment_id, room_id, floor_id, title, content, status, description, files, assign_to, action, created_by, created_at, updated_by, updated_at)
                VALUES (OLD.id, OLD.house_id, OLD.equipment_id, OLD.room_id, OLD.floor_id, OLD.title, OLD.content, OLD.status, OLD.description, OLD.files, OLD.assign_to, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
                `);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER issue_delete;`);
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER issue_delete
                BEFORE DELETE
                ON issues
                FOR EACH ROW
                INSERT INTO issue_history (issue_id, house_id, equipment_id, room_id, floor_id, title, content, status, description, files, assign_to, action, created_by, created_at, updated_by, updated_at)
                VALUES (OLD.id, OLD.house_id, OLD.equipment_id, OLD.room_id, OLD.floor_id, OLD.title, OLD.content, OLD.status, OLD.description, OLD.files, OLD.assign_to, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
                `);
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable("issues", (table) => {
            table.dropForeign("house_id");
            table.dropForeign("room_id");
            table.dropForeign("floor_id");
            table.dropColumn("house_id");
            table.dropColumn("room_id");
            table.dropColumn("floor_id");
        })
        .alterTable("issue_history", (table) => {
            table.dropForeign("house_id");
            table.dropForeign("room_id");
            table.dropForeign("floor_id");
            table.dropColumn("house_id");
            table.dropColumn("room_id");
            table.dropColumn("floor_id");
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER issue_create;`);
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER issue_create
                AFTER INSERT
                ON issues
                FOR EACH ROW
                INSERT INTO issue_history (issue_id, equipment_id, title, content, status, description, files, assign_to, action, created_by, created_at, updated_by, updated_at)
                VALUES (NEW.id, NEW.equipment_id, NEW.title, NEW.content, NEW.status, NEW.description, NEW.files, NEW.assign_to, "CREATE", NEW.created_by, NEW.created_at, NEW.updated_by, NEW.updated_at);
                `);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER issue_update;`);
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER issue_update
                BEFORE UPDATE
                ON issues
                FOR EACH ROW
                INSERT INTO issue_history (issue_id, equipment_id, title, content, status, description, files, assign_to, action, created_by, created_at, updated_by, updated_at)
                VALUES (OLD.id, OLD.equipment_id, OLD.title, OLD.content, OLD.status, OLD.description, OLD.files, OLD.assign_to, "UPDATE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
                `);
        })
        .then(() => {
            return knex.raw(`DROP TRIGGER issue_delete;`);
        })
        .then(() => {
            return knex.raw(`
                CREATE TRIGGER issue_delete
                BEFORE DELETE
                ON issues
                FOR EACH ROW
                INSERT INTO issue_history (issue_id, equipment_id, title, content, status, description, files, assign_to, action, created_by, created_at, updated_by, updated_at)
                VALUES (OLD.id, OLD.equipment_id, OLD.title, OLD.content, OLD.status, OLD.description, OLD.files, OLD.assign_to, "DELETE", OLD.created_by, OLD.created_at, OLD.updated_by, OLD.updated_at);
                `);
        });
}
