import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const contractTemplateExists = await knex.schema.hasTable("contract_template");
    const rentersExists = await knex.schema.hasTable("renters");

    if (contractTemplateExists && rentersExists) {
        return knex.schema.table("house_lease_contract_history", (table) => {
            table.integer("renter_id").index().references("id").inTable("renters").onDelete("SET NULL").onUpdate("CASCADE").after("house_id");
            table.integer("price").notNullable().defaultTo(0).after("onwer_email");
            table.integer("price_type").notNullable().defaultTo(0).after("price");
            table.integer("deposit").notNullable().defaultTo(0).after("price_type");
            table.dateTime("received_deposit_at").nullable().after("deposit");
            table.integer("contract_template_id").index().references("id").inTable("contract_template").onDelete("SET NULL").onUpdate("CASCADE").after("house_id");
        });
    } else {
        throw new Error("Referenced table 'contract_template' or 'renters' does not exist.");
    }
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("house_lease_contract", (table) => {
        table.dropForeign(["contract_template_id"]);
        table.dropColumn("contract_template_id");
        table.dropForeign(["renter_id"]);
        table.dropColumn("renter_id");
        table.dropColumn("deposit");
        table.dropColumn("received_deposit_at");
        table.renameColumn("onwer_email", "owner_email");
        table.dropColumn("file_contract");
    });
}
