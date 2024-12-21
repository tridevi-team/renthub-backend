import { EquipmentStatus, EquipmentType } from "@/src/enums";
import { en, Faker, vi } from "@faker-js/faker";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Equipment, Floor, Room } from "./interface";

const faker = new Faker({
    locale: [vi, en],
});

(async () => {
    const equipment: Equipment[] = [];
    const floors = JSON.parse(fs.readFileSync(__dirname + "/data/floors.json", "utf-8")) as Floor[];
    const rooms = JSON.parse(fs.readFileSync(__dirname + "/data/rooms.json", "utf-8")) as Room[];

    // Generate equipment in floors
    for (const floor of floors) {
        const floorEquipment: Equipment[] = [
            {
                id: uuidv4(),
                house_id: floor.house_id,
                floor_id: floor.id,
                code: faker.string
                    .alphanumeric({
                        length: 10,
                    })
                    .toUpperCase(),
                name: "Thang máy",
                status: EquipmentStatus.NORMAL,
                shared_type: EquipmentType.HOUSE,
                description: "Thang máy",
                created_by: floor.created_by,
                updated_by: floor.created_by,
            },
            {
                id: uuidv4(),
                house_id: floor.house_id,
                floor_id: floor.id,
                code: faker.string
                    .alphanumeric({
                        length: 10,
                    })
                    .toUpperCase(),
                name: "Thang thoát hiểm",
                status: EquipmentStatus.NORMAL,
                shared_type: EquipmentType.HOUSE,
                description: "Thang thoát hiểm",
                created_by: floor.created_by,
                updated_by: floor.created_by,
            },
            {
                id: uuidv4(),
                house_id: floor.house_id,
                floor_id: floor.id,
                code: faker.string
                    .alphanumeric({
                        length: 10,
                    })
                    .toUpperCase(),
                name: "Bình chữa cháy",
                status: EquipmentStatus.NORMAL,
                shared_type: EquipmentType.HOUSE,
                description: "Bình chữa cháy",
                created_by: floor.created_by,
                updated_by: floor.created_by,
            },
        ];
        equipment.push(...floorEquipment);
    }

    // Generate equipment in rooms
    for (const room of rooms) {
        const floorInfo = floors.find((floor) => floor.id === room.floor_id) as Floor;

        const roomEquipment: Equipment[] = [
            {
                id: uuidv4(),
                house_id: floorInfo?.house_id,
                room_id: room.id,
                code: faker.string
                    .alphanumeric({
                        length: 10,
                    })
                    .toUpperCase(),
                name: "Giường",
                status: EquipmentStatus.NORMAL,
                shared_type: EquipmentType.ROOM,
                description: "Giường",
                created_by: room.created_by,
                updated_by: room.created_by,
            },
            // tủ quần áo
            {
                id: uuidv4(),
                house_id: floorInfo?.house_id,
                room_id: room.id,
                code: faker.string
                    .alphanumeric({
                        length: 10,
                    })
                    .toUpperCase(),
                name: "Tủ quần áo",
                status: EquipmentStatus.NORMAL,
                shared_type: EquipmentType.ROOM,
                description: "Tủ quần áo",
                created_by: room.created_by,
                updated_by: room.created_by,
            },
            // điều hòa
            {
                id: uuidv4(),
                house_id: floorInfo?.house_id,
                room_id: room.id,
                code: faker.string
                    .alphanumeric({
                        length: 10,
                    })
                    .toUpperCase(),
                name: "Điều hòa",
                status: EquipmentStatus.NORMAL,
                shared_type: EquipmentType.ROOM,
                description: "Điều hòa",
                created_by: room.created_by,
                updated_by: room.created_by,
            },
        ];

        equipment.push(...roomEquipment);
    }
    fs.writeFile(__dirname + "/data/equipment.json", JSON.stringify(equipment, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("File has been created");
    });
})();
