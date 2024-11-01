import { faker } from "@faker-js/faker";
import type { Knex } from "knex";
import { RoomStatus } from "../../enums";

interface User {
    id: string;
    email: string;
    password: string;
    full_name: string;
    gender: string;
    phone_number: string;
    address: string;
    birthday: Date;
    role: string;
    type: string;
    status: number;
    verify: number;
    first_login: number;
}
interface City {
    name: string;
    code: number;
    division_type: string;
    phone_code: number;
    districts: Array<District>;
}

interface District {
    name: string;
    code: number;
    codename: string;
    division_type: string;
    short_codename: string;
    wards: Array<Ward>;
}

interface Ward {
    name: string;
    code: number;
    codename: string;
    division_type: string;
    short_codename: string;
}
interface House {
    id: string;
    name: string;
    contract_default: null | string;
    description: string;
    collection_cycle: number;
    invoice_date: number;
    num_collect_days: number;
    status: number;
    created_by: string;
    updated_by: string;
    address: {
        city: string;
        district: string;
        ward: string;
        street: string;
    };
}

interface Floor {
    id: string;
    house_id: string;
    name: string;
    description: string;
    created_by: string;
    updated_by: string;
}
interface Room {
    id: string;
    floor_id: string;
    name: string;
    max_renters: number;
    room_area: number;
    price: number;
    description: string;
    status: RoomStatus;
    created_by: string;
    updated_by: string;
}
interface RoomService {
    id: string;
    room_id: string;
    service_id: string;
    quantity: number;
    start_index: number | null;
    description: string;
    created_by: string;
    updated_by: string;
}
interface RoomImage {
    room_id: string;
    image_url: string;
    description: string;
    created_by: string;
}

export async function seed(knex: Knex): Promise<void> {
    await knex("room_images").del();
    await knex("room_services").del();
    await knex("services").del();
    await knex("rooms").del();
    await knex("house_floors").del();
    await knex("houses").del();
    await knex("users").del();

    // insert system user
    await knex("users").insert([
        {
            email: "system@tmquang.com",
            password: "123456",
            full_name: "System",
            phone_number: "0399999999",
            gender: "male",
            role: "system",
            address: "Ha Noi",
            birthday: "2003/05/01",
            verify: true,
        },
    ]);

    const startPhone = ["032", "033", "034", "035", "036", "037", "038", "039"];
    const genders = ["male", "female", "other"];

    const users: User[] = [];

    for (let i = 0; i < 100; i++) {
        const randomPhoneNumber =
            startPhone[Math.floor(Math.random() * startPhone.length)] + Math.floor(1000000 + Math.random() * 9000000);
        const randomGender = genders[Math.floor(Math.random() * 3)];
        users.push({
            id: faker.string.uuid(),
            email: faker.internet.email(),
            password: "123456",
            full_name: faker.person.fullName(),
            gender: randomGender,
            phone_number: randomPhoneNumber,
            address: faker.location.streetAddress(),
            birthday: faker.date.past(),
            role: "user",
            type: "free",
            status: 1,
            verify: 1,
            first_login: 1,
        });
    }

    await knex("users").insert(users);

    const fetchAddress = async () => {
        const response = await fetch("https://provinces.open-api.vn/api/?depth=3");
        const data = await response.json();
        return data;
    };

    const address = await fetchAddress().then((data) =>
        (data as Array<City>).filter((city: City) => city.name === "Thành phố Hà Nội")
    );

    const houses: House[] = [];

    for (let i = 0; i < 50; i++) {
        for (let j = 0; j < 10; j++) {
            const randomDistrict = address[0].districts[Math.floor(Math.random() * address[0].districts.length)];
            const randomWard = randomDistrict.wards[Math.floor(Math.random() * randomDistrict.wards.length)];
            const randomStreet = faker.location.street();

            const randomAddress = {
                city: "Thành phố Hà Nội",
                district: randomDistrict.name,
                ward: randomWard.name,
                street: randomStreet,
            };

            houses.push({
                id: faker.string.uuid(),
                name: faker.lorem.words(),
                contract_default: null,
                description: faker.lorem.paragraph(),
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
                created_by: users[i].id,
                updated_by: users[i].id,
                address: randomAddress,
            });
        }
    }

    await knex("houses").insert(houses);

    for (let i = 0; i < houses.length; i++) {
        const floors: Floor[] = [];
        const numFloors = faker.number.int({
            min: 3,
            max: 7,
        });

        for (let j = 0; j < numFloors; j++) {
            const randomFloor = {
                id: faker.string.uuid(),
                house_id: houses[i].id,
                name: `Tầng ${j + 1}`,
                description: faker.lorem.paragraph(),
                created_by: houses[i].created_by,
                updated_by: houses[i].created_by,
            };

            floors.push(randomFloor);
        }

        await knex("house_floors").insert(floors);

        const services = [
            {
                id: faker.string.uuid(),
                house_id: houses[i].id,
                name: "Điện",
                unit_price: 4000,
                type: "AMOUNT",
                has_index: 1,
                description: "Dịch vụ điện",
                created_by: houses[i].created_by,
                updated_by: houses[i].created_by,
            },
            {
                id: faker.string.uuid(),
                house_id: houses[i].id,
                name: "Nước",
                unit_price: 10000,
                type: "AMOUNT",
                has_index: 1,
                description: "Dịch vụ nước",
                created_by: houses[i].created_by,
                updated_by: houses[i].created_by,
            },
            {
                id: faker.string.uuid(),
                house_id: houses[i].id,
                name: "Internet",
                unit_price: 100000,
                type: "ROOM",
                has_index: 0,
                description: "Dịch vụ internet",
                created_by: houses[i].created_by,
                updated_by: houses[i].created_by,
            },
            {
                id: faker.string.uuid(),
                house_id: houses[i].id,
                name: "Rác",
                unit_price: 50000,
                type: "PEOPLE",
                has_index: 0,
                description: "Phí vệ sinh môi trường",
                created_by: houses[i].created_by,
                updated_by: houses[i].created_by,
            },
            {
                id: faker.string.uuid(),
                house_id: houses[i].id,
                name: "Giữ xe",
                unit_price: 50000,
                type: "PEOPLE",
                has_index: 0,
                description: "Phí giữ xe",
                created_by: houses[i].created_by,
                updated_by: houses[i].created_by,
            },
        ];

        await knex("services").insert(services);

        const rooms: Room[] = [];
        const usedRoomIds = new Set();
        for (let j = 0; j < floors.length; j++) {
            const numRooms = faker.number.int({
                min: 3,
                max: 5,
            });

            for (let k = 0; k < numRooms; k++) {
                let randomRoomId;
                do {
                    randomRoomId = faker.string.uuid();
                } while (usedRoomIds.has(randomRoomId));

                usedRoomIds.add(randomRoomId);

                const roomNumber =
                    k < 10 ? floors[j].name.split(" ")[1] + "0" + (k + 1) : floors[j].name.split(" ")[1] + (k + 1);
                const roomName = `Phòng ${roomNumber}`;
                const randomRoom = {
                    id: randomRoomId,
                    floor_id: floors[j].id,
                    name: roomName,
                    max_renters: faker.number.int({
                        min: 1,
                        max: 5,
                    }),
                    room_area: faker.number.int({
                        min: 10,
                        max: 50,
                    }),
                    price: faker.number.int({
                        min: 1000000,
                        max: 5000000,
                    }),
                    description: faker.lorem.paragraph(),
                    status: RoomStatus.AVAILABLE,
                    created_by: houses[i].created_by,
                    updated_by: houses[i].created_by,
                };

                rooms.push(randomRoom);
            }
        }

        await knex("rooms").insert(rooms);

        for (let k = 0; k < rooms.length; k++) {
            const roomServices: RoomService[] = [];
            for (let l = 0; l < services.length; l++) {
                const startIndex = services[l].has_index ? faker.number.int({ min: 1, max: 100 }) : null;
                const randomRoomService = {
                    id: faker.string.uuid(),
                    room_id: rooms[k].id,
                    service_id: services[l].id,
                    quantity: faker.number.int({
                        min: 1,
                        max: 5,
                    }),
                    start_index: startIndex,
                    description: faker.lorem.paragraph(),
                    created_by: houses[i].created_by,
                    updated_by: houses[i].created_by,
                };

                roomServices.push(randomRoomService);
            }

            await knex("room_services").insert(roomServices);

            const roomImages: RoomImage[] = [];
            for (let l = 0; l < 2; l++) {
                const randomRoomImage = {
                    room_id: rooms[k].id,
                    image_url: faker.image.url(),
                    description: faker.lorem.sentence(),
                    created_by: houses[i].created_by,
                };

                roomImages.push(randomRoomImage);
            }

            await knex("room_images").insert(roomImages);
        }
    }
}
