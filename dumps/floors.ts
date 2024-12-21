import { en, Faker, vi } from "@faker-js/faker";
import fs from "fs";
import { Floor } from "./interface";

const faker = new Faker({
    locale: [vi, en],
});

// (async () => {
//     const houses = JSON.parse(fs.readFileSync(__dirname + "/data/houses.json", "utf-8"));
//     const floors: Floor[] = [];

//     let count = 0;
//     for (const house of houses) {
//         const numFloors = Math.floor(Math.random() * 7) + 4;
//         for (let i = 0; i < numFloors; i++) {
//             console.log(`Generating floor... ${count++}`);
//             const floor: Floor = {
//                 id: faker.string.uuid(),
//                 house_id: house.id,
//                 name: `Tầng ${i + 1}`,
//                 description: faker.lorem.paragraph({
//                     min: 10,
//                     max: 20,
//                 }),
//                 created_by: house.created_by,
//                 updated_by: house.updated_by,
//             };
//             floors.push(floor);
//         }
//     }

//     fs.writeFile("./dumps/data/floors.json", JSON.stringify(floors, null, 4), (err) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.log("File has been created");
//     });
// })();

(async () => {
    const floors = JSON.parse(fs.readFileSync(__dirname + "/data/floors.json", "utf-8")) as Floor[];

    // update description
    for (const floor of floors) {
        floor.description = faker.lorem.sentences({
            min: 1,
            max: 3,
        });
    }

    fs.writeFile("./dumps/data/floors.json", JSON.stringify(floors, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("File has been updated");
    });
})();
