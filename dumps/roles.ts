import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { House, Roles } from "./interface";

(async () => {
    const roles: Roles[] = [];
    const houses = JSON.parse(fs.readFileSync(__dirname + "/data/houses.json", "utf-8")) as House[];

    for (const house of houses) {
        const houseRoles: Roles[] = [
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Quản lý tòa nhà",
                permissions: {
                    house: { create: true, read: true, update: true, delete: true },
                    floor: { create: true, read: true, update: true, delete: true },
                    room: { create: true, read: true, update: true, delete: true },
                    role: { create: true, read: true, update: true, delete: true },
                    renter: { create: true, read: true, update: true, delete: true },
                    service: { create: true, read: true, update: true, delete: true },
                    equipment: { create: true, read: true, update: true, delete: true },
                    payment: { create: true, read: true, update: true, delete: true },
                    bill: { create: true, read: true, update: true, delete: true },
                    notification: { create: true, read: true, update: true, delete: true },
                    issue: { create: true, read: true, update: true, delete: true },
                },
                description: "Quản lý tòa nhà",
                status: true,
                created_by: house.created_by,
                updated_by: house.created_by,
            },
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Quản lý tầng",
                permissions: {
                    house: { create: false, read: true, update: false, delete: false },
                    floor: { create: true, read: true, update: true, delete: true },
                    room: { create: false, read: true, update: false, delete: false },
                    role: { create: false, read: false, update: false, delete: false },
                    renter: { create: false, read: false, update: false, delete: false },
                    service: { create: false, read: false, update: false, delete: false },
                    equipment: { create: false, read: false, update: false, delete: false },
                    payment: { create: false, read: false, update: false, delete: false },
                    bill: { create: false, read: false, update: false, delete: false },
                    notification: { create: false, read: false, update: false, delete: false },
                    issue: { create: false, read: false, update: false, delete: false },
                },
                description: "Quản lý tầng",
                status: true,
                created_by: house.created_by,
                updated_by: house.created_by,
            },
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Quản lý phòng",
                permissions: {
                    house: { create: false, read: true, update: false, delete: false },
                    floor: { create: false, read: true, update: false, delete: false },
                    room: { create: true, read: true, update: true, delete: true },
                    role: { create: false, read: false, update: false, delete: false },
                    renter: { create: true, read: true, update: true, delete: true },
                    service: { create: false, read: true, update: false, delete: false },
                    equipment: { create: true, read: true, update: true, delete: true },
                    payment: { create: false, read: false, update: false, delete: false },
                    bill: { create: false, read: true, update: false, delete: false },
                    notification: { create: true, read: true, update: true, delete: true },
                    issue: { create: false, read: true, update: false, delete: false },
                },
                description: "Quản lý phòng, chịu trách nhiệm về phòng",
                status: true,
                created_by: house.created_by,
                updated_by: house.created_by,
            },
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Quản lý dịch vụ",
                permissions: {
                    house: { create: false, read: true, update: false, delete: false },
                    floor: { create: false, read: true, update: false, delete: false },
                    room: { create: false, read: true, update: false, delete: false },
                    role: { create: false, read: false, update: false, delete: false },
                    renter: { create: false, read: false, update: false, delete: false },
                    service: { create: true, read: true, update: true, delete: true },
                    equipment: { create: false, read: false, update: false, delete: false },
                    payment: { create: false, read: false, update: false, delete: false },
                    bill: { create: false, read: false, update: false, delete: false },
                    notification: { create: false, read: false, update: false, delete: false },
                    issue: { create: false, read: false, update: false, delete: false },
                },
                description: "Quản lý dịch vụ",
                status: true,
                created_by: house.created_by,
                updated_by: house.created_by,
            },
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Quản lý thiết bị",
                permissions: {
                    house: { create: false, read: true, update: false, delete: false },
                    floor: { create: false, read: true, update: false, delete: false },
                    room: { create: false, read: true, update: false, delete: false },
                    role: { create: false, read: false, update: false, delete: false },
                    renter: { create: false, read: false, update: false, delete: false },
                    service: { create: false, read: false, update: false, delete: false },
                    equipment: { create: true, read: true, update: true, delete: true },
                    payment: { create: false, read: false, update: false, delete: false },
                    bill: { create: false, read: false, update: false, delete: false },
                    notification: { create: false, read: false, update: false, delete: false },
                    issue: { create: false, read: false, update: false, delete: false },
                },
                description: "Quản lý thiết bị",
                status: true,
                created_by: house.created_by,
                updated_by: house.created_by,
            },
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Quản lý thanh toán",
                permissions: {
                    house: { create: false, read: true, update: false, delete: false },
                    floor: { create: false, read: true, update: false, delete: false },
                    room: { create: false, read: true, update: false, delete: false },
                    role: { create: false, read: false, update: false, delete: false },
                    renter: { create: false, read: false, update: false, delete: false },
                    service: { create: false, read: false, update: false, delete: false },
                    equipment: { create: false, read: false, update: false, delete: false },
                    payment: { create: true, read: true, update: true, delete: true },
                    bill: { create: false, read: false, update: false, delete: false },
                    notification: { create: false, read: false, update: false, delete: false },
                    issue: { create: false, read: false, update: false, delete: false },
                },
                description: "Quản lý thanh toán",
                status: true,
                created_by: house.created_by,
                updated_by: house.created_by,
            },
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Quản lý hóa đơn",
                permissions: {
                    house: { create: false, read: true, update: false, delete: false },
                    floor: { create: false, read: true, update: false, delete: false },
                    room: { create: false, read: true, update: false, delete: false },
                    role: { create: false, read: false, update: false, delete: false },
                    renter: { create: false, read: false, update: false, delete: false },
                    service: { create: false, read: false, update: false, delete: false },
                    equipment: { create: false, read: false, update: false, delete: false },
                    payment: { create: false, read: false, update: false, delete: false },
                    bill: { create: true, read: true, update: true, delete: true },
                    notification: { create: false, read: false, update: false, delete: false },
                    issue: { create: false, read: false, update: false, delete: false },
                },
                description: "Quản lý hóa đơn",
                status: true,
                created_by: house.created_by,
                updated_by: house.created_by,
            },
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Quản lý thông báo",
                permissions: {
                    house: { create: false, read: true, update: false, delete: false },
                    floor: { create: false, read: true, update: false, delete: false },
                    room: { create: false, read: true, update: false, delete: false },
                    role: { create: false, read: false, update: false, delete: false },
                    renter: { create: false, read: false, update: false, delete: false },
                    service: { create: false, read: false, update: false, delete: false },
                    equipment: { create: false, read: false, update: false, delete: false },
                    payment: { create: false, read: false, update: false, delete: false },
                    bill: { create: false, read: false, update: false, delete: false },
                    notification: { create: true, read: true, update: true, delete: true },
                    issue: { create: false, read: false, update: false, delete: false },
                },
                description: "Quản lý thông báo",
                status: true,
                created_by: house.created_by,
                updated_by: house.created_by,
            },
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Quản lý sự cố",
                permissions: {
                    house: { create: false, read: true, update: false, delete: false },
                    floor: { create: false, read: true, update: false, delete: false },
                    room: { create: false, read: true, update: false, delete: false },
                    role: { create: false, read: false, update: false, delete: false },
                    renter: { create: false, read: false, update: false, delete: false },
                    service: { create: false, read: false, update: false, delete: false },
                    equipment: { create: false, read: false, update: false, delete: false },
                    payment: { create: false, read: false, update: false, delete: false },
                    bill: { create: false, read: false, update: false, delete: false },
                    notification: { create: false, read: false, update: false, delete: false },
                    issue: { create: true, read: true, update: true, delete: true },
                },
                description: "Quản lý sự cố",
                status: true,
                created_by: house.created_by,
                updated_by: house.created_by,
            },
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Quản lý người thuê",
                permissions: {
                    house: { create: false, read: true, update: false, delete: false },
                    floor: { create: false, read: true, update: false, delete: false },
                    room: { create: false, read: true, update: false, delete: false },
                    role: { create: false, read: false, update: false, delete: false },
                    renter: { create: true, read: true, update: true, delete: true },
                    service: { create: false, read: false, update: false, delete: false },
                    equipment: { create: false, read: false, update: false, delete: false },
                    payment: { create: false, read: false, update: false, delete: false },
                    bill: { create: false, read: false, update: false, delete: false },
                    notification: { create: false, read: false, update: false, delete: false },
                    issue: { create: false, read: false, update: false, delete: false },
                },
                description: "Quản lý người thuê",
                status: true,
                created_by: house.created_by,
                updated_by: house.created_by,
            },
        ];
        roles.push(...houseRoles);
    }

    fs.writeFile(__dirname + "/data/roles.json", JSON.stringify(roles, null, 4), (err) => {
        if (err) {
            console.error(err);
        }

        console.log("Roles generated!");
    });
})();
