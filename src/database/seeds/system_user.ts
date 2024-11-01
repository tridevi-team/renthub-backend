import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        {
            email: "system@tmquang.com",
            password: "123456",
            full_name: "System",
            phone_number: "0399999999",
            gender: "male",
            address: "Ha Noi",
            role: "system",
            birthday: "2003/05/01",
            verify: true,
        },
    ]);
}
