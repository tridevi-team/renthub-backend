import fs from "fs";
import { Knex } from "knex";

const BATCH_SIZE = 1000;

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("bill_details").del();
    await knex("bills").del();
    await knex("equipment").del();
    await knex("roles").del();
    await knex("renters").del();
    await knex("payment_methods").del();
    await knex("room_images").del();
    await knex("room_services").del();
    await knex("services").del();
    await knex("rooms").del();
    await knex("house_floors").del();
    await knex("houses").del();
    await knex("users").del();

    const usersData = JSON.parse(fs.readFileSync(__dirname + "/data/users.json", "utf-8"));
    const housesData = JSON.parse(fs.readFileSync(__dirname + "/data/houses.json", "utf-8"));
    const servicesData = JSON.parse(fs.readFileSync(__dirname + "/data/services.json", "utf-8"));
    const paymentMethodsData = JSON.parse(fs.readFileSync(__dirname + "/data/payment_methods.json", "utf-8"));
    const houseFloorsData = JSON.parse(fs.readFileSync(__dirname + "/data/floors.json", "utf-8"));
    const roomsData = JSON.parse(fs.readFileSync(__dirname + "/data/rooms.json", "utf-8"));
    const roomServicesData = JSON.parse(fs.readFileSync(__dirname + "/data/room_services.json", "utf-8"));
    const roomImagesData = JSON.parse(fs.readFileSync(__dirname + "/data/room_images.json", "utf-8"));
    const rentersData = JSON.parse(fs.readFileSync(__dirname + "/data/renters.json", "utf-8"));
    const equipmentData = JSON.parse(fs.readFileSync(__dirname + "/data/equipment.json", "utf-8"));
    const rolesData = JSON.parse(fs.readFileSync(__dirname + "/data/roles.json", "utf-8"));
    const billsData = JSON.parse(fs.readFileSync(__dirname + "/data/bills.json", "utf-8"));
    const billDetailsData = JSON.parse(fs.readFileSync(__dirname + "/data/billDetails.json", "utf-8"));

    // Inserts seed entries
    console.log("Seeding data...");

    console.log("Seeding users...");
    await knex("users").insert(usersData);

    console.log("Seeding houses...");
    await knex("houses").insert(housesData);

    console.log("Seeding services...");
    await knex("services").insert(servicesData);

    console.log("Seeding floors...");
    await knex("house_floors").insert(houseFloorsData);

    await insertInBatches(knex, "rooms", roomsData);

    // await insertInBatches(knex, "payment_methods", paymentMethodsData);

    await insertInBatches(knex, "room_services", roomServicesData);

    await insertInBatches(knex, "room_images", roomImagesData);

    await knex("payment_methods").insert(paymentMethodsData);

    await insertInBatches(knex, "renters", rentersData);

    await insertInBatches(knex, "equipment", equipmentData);

    await insertInBatches(knex, "roles", rolesData);

    await insertInBatches(knex, "bills", billsData, (data) => ({
        ...data,
        payment_date: data.payment_date ? new Date(data.payment_date) : null,
    }));

    await insertInBatches(knex, "bill_details", billDetailsData);

    console.log("Seeding completed!");
}

async function insertInBatches(knex: Knex, tableName: string, data: any[], transformFn?: (item: any) => any) {
    console.log(`Seeding ${tableName}...`);
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        const transformedBatch = transformFn ? batch.map(transformFn) : batch;
        try {
            await knex(tableName).insert(transformedBatch);
        } catch (error) {
            console.log(`Error seeding ${tableName}:`, error);
        }
    }
}
