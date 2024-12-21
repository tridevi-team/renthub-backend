import { en, Faker, vi } from "@faker-js/faker";
import fs from "fs";
import { City, House } from "./interface";

const faker = new Faker({
    locale: [vi, en],
});

(async () => {
    const fetchAddress = async () => {
        const response = await fetch("https://provinces.open-api.vn/api/?depth=3");
        const data = await response.json();
        return data;
    };
    const address = await fetchAddress().then((data) =>
        (data as Array<City>).filter((city: City) => city.name === "Thành phố Hà Nội")
    );

    // read the users.json file
    const users = JSON.parse(fs.readFileSync(__dirname + "/data/users.json", "utf-8"));
    const houseNames = JSON.parse(fs.readFileSync(__dirname + "/houseName.json", "utf-8"));
    const uniqueNames = [...new Set(houseNames)] as string[];

    const houses: House[] = [];
    let count = 0;
    for (const user of users) {
        const numHouses = Math.floor(Math.random() * 3) + 3;
        for (let j = 0; j < numHouses; j++) {
            console.log(`Generating house... ${j}`);
            const randomDistrict = address[0].districts[Math.floor(Math.random() * address[0].districts.length)];
            const randomWard = randomDistrict.wards[Math.floor(Math.random() * randomDistrict.wards.length)];
            const randomStreet = faker.location.street();

            const randomAddress = {
                city: "Thành phố Hà Nội",
                district: randomDistrict.name,
                ward: randomWard.name,
                street: randomStreet,
            };
            const houseInfo: House = {
                id: faker.string.uuid(),
                name: uniqueNames[count++],
                contract_default: null,
                description: faker.lorem.paragraph({
                    min: 10,
                    max: 20,
                }),
                collection_cycle: 1,
                invoice_date: faker.number.int({
                    min: 1,
                    max: 28,
                }),
                num_collect_days: faker.number.int({
                    min: 1,
                    max: 7,
                }),
                status: 1,
                created_by: user.id,
                updated_by: user.id,
                address: randomAddress,
            };
            houses.push(houseInfo);
        }
    }
    fs.writeFile("./dumps/data/houses.json", JSON.stringify(houses, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("File has been created");
    });
    console.log("Total house names: ", uniqueNames.length);
    console.log("Total houses: ", houses.length);
})();
