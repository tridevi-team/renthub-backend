import { en, Faker, vi } from "@faker-js/faker";
import fs from "fs";
import { User } from "./interface";

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

// (async () => {
//     const password = await bcrypt.hash("123456");

//     const users: User[] = [
//         {
//             id: uuidv4(),
//             email: "system@tmquang.com",
//             password: password,
//             full_name: "System Admin",
//             phone_number: "0000000000",
//             gender: "male",
//             role: "user",
//             type: "free",
//             address: faker.location.city(),
//             birthday: new Date("2003/05/01"),
//             verify: true,
//             status: 1,
//             first_login: 1,
//         },
//         {
//             id: uuidv4(),
//             email: "tmquang0209@gmail.com",
//             password: password,
//             full_name: "Trần Minh Quang",
//             phone_number: "0397847805",
//             gender: "male",
//             role: "user",
//             type: "free",
//             address: "Hà Nội",
//             birthday: new Date("2003/05/01"),
//             verify: true,
//             status: 1,
//             first_login: 1,
//         },
//     ];

//     const numOfUser = 200;
//     for (let i = 0; i < numOfUser; i++) {
//         const genderRandom = Math.random() > 0.5 ? "male" : "female";
//         const fullName = faker.person.fullName({
//             sex: genderRandom,
//         });

//         const email = removeVietnameseTones(fullName).toLowerCase().replaceAll(" ", ".") + "@renthub.com";

//         const phoneNumber = "039" + faker.number.int({ min: 1000000, max: 9999999 });

//         const userInfo: User = {
//             id: uuidv4(),
//             email: email,
//             password: password,
//             full_name: fullName,
//             phone_number: phoneNumber,
//             gender: genderRandom,
//             role: "user",
//             type: "free",
//             address: faker.location.city(),
//             birthday: faker.date.birthdate({
//                 refDate: new Date("1990/05/01"),
//             }),
//             verify: Math.random() > 0.5 ? true : false,
//             status: Math.random() > 0.5 ? 1 : 0,
//             first_login: 1,
//         };

//         users.push(userInfo);
//     }

//     fs.writeFile("./dumps/data/users.json", JSON.stringify(users, null, 4), (err) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.log("File has been created");
//     });
// })();

// refactor birthday and address
(async () => {
    const fetchAddress = async () => {
        const response = await fetch("https://provinces.open-api.vn/api/?depth=3");
        const data = await response.json();
        return data;
    };

    const provincesList = (await fetchAddress()) as any[];

    const users = JSON.parse(fs.readFileSync("./dumps/data/users.json", "utf-8")) as User[];

    // convert birthday to format: YYYY-MM-DD
    users.forEach((user) => {
        // check email is duplicated
        const email = user.email;

        const isDuplicated = users.filter((u) => u.email === email).length > 1;
        if (isDuplicated) {
            user.email = user.email.split("@")[0] + Math.floor(Math.random() * 1000) + "@renthub.com";
        }

        user.birthday = faker.date
            .between({ from: new Date("1980/01/01"), to: new Date("2000/12/31") })
            .toISOString()
            .split("T")[0];

        // random address
        const randomCity = provincesList[Math.floor(Math.random() * provincesList.length)];
        const randomDistrict = randomCity.districts[Math.floor(Math.random() * randomCity.districts.length)];
        const randomWard = randomDistrict.wards[Math.floor(Math.random() * randomDistrict.wards.length)];
        const randomStreet = faker.location.streetAddress();

        user.address = {
            city: randomCity.name,
            district: randomDistrict.name,
            ward: randomWard?.name,
            street: randomStreet,
        };
    });

    fs.writeFile("./dumps/data/users.json", JSON.stringify(users, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("File has been created");
    });
})();
