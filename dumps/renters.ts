import { RoomStatus } from "@/src/enums";
import { en, Faker, vi } from "@faker-js/faker";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Renter, Room } from "./interface";

const faker = new Faker({
    locale: [vi, en],
});

const removeVietnameseTones = (str) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
};

(async () => {
    const fetchAddress = async () => {
        const response = await fetch("https://provinces.open-api.vn/api/?depth=3");
        const data = await response.json();
        return data;
    };

    const provincesList = (await fetchAddress()) as any[];

    const rooms = JSON.parse(fs.readFileSync(__dirname + "/data/rooms.json", "utf-8")) as Room[];

    const rentedRooms = rooms.filter((room) => room.status === RoomStatus.RENTED);

    const renters: Renter[] = [];

    for (const room of rentedRooms) {
        const numOfRenters =
            room.max_renters === -1
                ? faker.number.int({
                      min: 1,
                      max: 5,
                  })
                : faker.number.int({
                      min: 0,
                      max: room.max_renters,
                  });

        for (let i = 0; i < numOfRenters; i++) {
            const genderRandom = Math.random() > 0.5 ? "male" : "female";
            const fullName = faker.person.fullName({
                sex: genderRandom,
            });

            let email = removeVietnameseTones(fullName).toLowerCase().replaceAll(" ", ".") + "@renter.com";

            // check email
            const existEmail = renters.find((renter) => renter.email === email);
            if (existEmail) {
                email = email.split("@")[0] + Math.floor(Math.random() * 1000) + "@renter.com";
            }

            let phoneNumber = "039" + faker.number.int({ min: 1000000, max: 9999999 });

            // check phone number
            const existPhoneNumber = renters.find((renter) => renter.phone_number === phoneNumber);
            if (existPhoneNumber) {
                phoneNumber = "0" + faker.number.int({ min: 100000000, max: 999999999 });
            }

            let represent = Math.random() > 0.5 ? true : false;

            // check represent
            if (represent) {
                const existRepresent = renters.find(
                    (renter) => renter.represent === true && renter.room_id === room.id
                );
                if (existRepresent) {
                    represent = false;
                }
            }

            // random address
            const randomCity = provincesList[Math.floor(Math.random() * provincesList.length)];
            const randomDistrict = randomCity.districts[Math.floor(Math.random() * randomCity.districts.length)];
            const randomWard = randomDistrict.wards[Math.floor(Math.random() * randomDistrict.wards.length)];
            const randomStreet = faker.location.streetAddress();

            renters.push({
                id: uuidv4(),
                room_id: room.id,
                name: fullName,
                citizen_id: faker.number
                    .bigInt({
                        min: 100000000000,
                        max: 999999999999,
                    })
                    .toString(),
                birthday: faker.date
                    .between({
                        from: new Date("1986-01-01"),
                        to: new Date("2006-12-31"),
                    })
                    .toISOString()
                    .split("T")[0],
                address: {
                    city: randomCity.name,
                    district: randomDistrict.name,
                    ward: randomWard?.name,
                    street: randomStreet,
                },
                email: email,
                phone_number: phoneNumber,
                gender: genderRandom,
                temp_reg: Math.random() > 0.5 ? true : false,
                move_in_date: faker.date
                    .between({
                        from: new Date("2024-01-01"),
                        to: new Date("2024-12-31"),
                    })
                    .toISOString()
                    .split("T")[0],
                represent: represent,
                created_by: room.created_by,
                updated_by: room.created_by,
            });
        }
    }

    console.log(renters.length);
    fs.writeFile(__dirname + "/data/renters.json", JSON.stringify(renters, null, 4), (err) => {
        if (err) {
            console.error(err);
        }

        console.log("Renters generated!");
    });
})();
