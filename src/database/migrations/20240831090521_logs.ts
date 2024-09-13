import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("logs", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
        table.datetime("request_timestamp").defaultTo(knex.fn.now());
        table.string("client_ip", 45).notNullable();
        table.string("endpoint", 255).notNullable();
        table.enum("request_method", ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"]).notNullable();
        table.integer("status_code").notNullable();
        table.text("user_agent").notNullable();
        table.integer("response_time_ms").notNullable();
        table.string("referrer", 255).nullable();
        table.text("request_payload").nullable();
        table.text("response_payload").nullable();
        table.json("additional_info").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("logs");
}
