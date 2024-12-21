import { en, Faker, vi } from "@faker-js/faker";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { House, PaymentMethod, User } from "./interface";

const faker = new Faker({
    locale: [vi, en],
});

(async () => {
    const banksList = await fetch("https://api.vietqr.io/v2/banks").then(
        (response) => response.json() as Promise<{ data: any }>
    );
    const paymentMethods: PaymentMethod[] = [];
    const houses: House[] = JSON.parse(fs.readFileSync(__dirname + "/data/houses.json", "utf-8"));
    const users: User[] = JSON.parse(fs.readFileSync(__dirname + "/data/users.json", "utf-8"));

    for (const house of houses) {
        const user = users.find((user) => user.id === house.created_by) as User;
        const bankIndex = Math.floor(Math.random() * banksList.data.length);
        const bank = banksList.data[bankIndex];
        const paymentMethod: PaymentMethod = {
            id: uuidv4(),
            house_id: house.id,
            name: user.full_name,
            account_number: faker.finance.accountNumber({
                length: 16,
            }),
            bank_name: bank.shortName,
            status: true,
            created_by: house.created_by,
            description: faker.lorem.sentence(),
            is_default: true,
            updated_by: house.created_by,
        };
        paymentMethods.push(paymentMethod);
    }

    fs.writeFile(__dirname + "/data/payment_methods.json", JSON.stringify(paymentMethods, null, 4), (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Payment methods data generated successfully!");
        }
    });
})();
