import { BillStatus, RoomStatus, ServiceTypes } from "@/src/enums";
import { en, Faker, vi } from "@faker-js/faker";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Bill, BillDetail, Floor, PaymentMethod, Renter, Room, RoomService, Service } from "./interface";

const BATCH_SIZE = 1; // Number of rooms to process in each batch

const faker = new Faker({
    locale: [vi, en],
});

const ensureDirectoryExistence = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// (async () => {
//     const floors = JSON.parse(fs.readFileSync(__dirname + "/data/floors.json", "utf-8")) as Floor[];
//     const rooms = JSON.parse(fs.readFileSync(__dirname + "/data/rooms.json", "utf-8")) as Room[];
//     const services = JSON.parse(fs.readFileSync(__dirname + "/data/services.json", "utf-8")) as Service[];
//     const roomServices: RoomService[] = JSON.parse(fs.readFileSync(__dirname + "/data/roomServices.json", "utf-8"));
//     const renters: Renter[] = JSON.parse(fs.readFileSync(__dirname + "/data/renters.json", "utf-8"));
//     const paymentMethods = JSON.parse(
//         fs.readFileSync(__dirname + "/data/payment_methods.json", "utf-8")
//     ) as PaymentMethod[];

//     const billsDir = path.join(__dirname, "/data/bills");
//     const billDetailsDir = path.join(__dirname, "/data/bill_details");

//     ensureDirectoryExistence(billsDir);
//     ensureDirectoryExistence(billDetailsDir);

//     const rentedRooms = rooms.filter((r) => r.status === RoomStatus.RENTED);

//     for (const room of rentedRooms) {
//         const roomServiceData = roomServices.filter((rs) => rs.room_id === room.id) as RoomService[];
//         if (!roomServiceData) continue;

//         const floor = floors.find((f) => f.id === room.floor_id) as Floor;
//         const paymentMethod = paymentMethods.find((pm) => pm.house_id === floor.house_id);
//         const numOfRenters = renters.filter((r) => r.room_id === room.id).length;

//         let waterIndex = faker.number.int({ min: 1, max: 1000 });
//         let electricityIndex = faker.number.int({ min: 1, max: 1000 });

//         for (let month = 1; month <= 12; month++) {
//             console.log(`Processing room ${room.id} - month ${month}`);
//             const randomStatus =
//                 BillStatus[
//                     Object.keys(BillStatus)[
//                         Math.floor(Math.random() * Object.keys(BillStatus).length)
//                     ] as keyof typeof BillStatus
//                 ];

//             const billRoom: Bill = {
//                 id: uuidv4(),
//                 room_id: room.id,
//                 payment_method_id: paymentMethod?.id,
//                 title: `Hóa đơn tháng ${month} - 2024`,
//                 amount: 0,
//                 status: randomStatus,
//                 payment_date:
//                     randomStatus === BillStatus.PAID
//                         ? faker.date.between({
//                               from: new Date(2024, month - 1, 1),
//                               to: new Date(2024, month - 1, 10),
//                           })
//                         : null,
//                 created_by: room.created_by,
//                 updated_by: room.updated_by,
//             };

//             const billDetails: BillDetail[] = [];

//             const baseDetail: BillDetail = {
//                 id: uuidv4(),
//                 bill_id: billRoom.id,
//                 service_id: null,
//                 name: "Tiền phòng",
//                 amount: 1,
//                 unit_price: room.price,
//                 total_price: room.price,
//                 created_by: room.created_by,
//                 updated_by: room.updated_by,
//             };

//             billRoom.amount += baseDetail.total_price;

//             console.log(`Room ${room.id} - month ${month} - current amount: ${billRoom.amount}`);

//             billDetails.push(baseDetail);

//             for (const roomServiceItem of roomServiceData) {
//                 const service = services.find((s) => s.id === roomServiceItem.service_id) as Service;
//                 let detail: BillDetail | null = null;

//                 switch (service.type) {
//                     case ServiceTypes.PEOPLE:
//                         detail = {
//                             id: uuidv4(),
//                             bill_id: billRoom.id,
//                             service_id: roomServiceItem.service_id,
//                             name: service.name,
//                             amount: numOfRenters,
//                             unit_price: service.unit_price || 0,
//                             total_price: service.unit_price ? service.unit_price * numOfRenters : 0,
//                             created_by: room.created_by,
//                             updated_by: room.updated_by,
//                         };
//                         break;
//                     case ServiceTypes.ROOM:
//                         detail = {
//                             id: uuidv4(),
//                             bill_id: billRoom.id,
//                             service_id: roomServiceItem.service_id,
//                             name: service.name,
//                             amount: 1,
//                             unit_price: service.unit_price || 0,
//                             total_price: service.unit_price || 0,
//                             created_by: room.created_by,
//                             updated_by: room.updated_by,
//                         };
//                         break;
//                     case ServiceTypes.WATER_CONSUMPTION:
//                         const newWaterIndex = faker.number.int({ min: waterIndex, max: waterIndex + 10 });
//                         const waterAmount = newWaterIndex - waterIndex;
//                         waterIndex = newWaterIndex;
//                         detail = {
//                             id: uuidv4(),
//                             bill_id: billRoom.id,
//                             service_id: roomServiceItem.service_id,
//                             name: service.name,
//                             amount: waterAmount,
//                             unit_price: service.unit_price || 0,
//                             total_price: service.unit_price ? service.unit_price * waterAmount : 0,
//                             created_by: room.created_by,
//                             updated_by: room.updated_by,
//                         };
//                         break;
//                     case ServiceTypes.ELECTRICITY_CONSUMPTION:
//                         const newElectricityIndex = faker.number.int({
//                             min: electricityIndex + 50,
//                             max: electricityIndex + 200,
//                         });
//                         const electricityAmount = newElectricityIndex - electricityIndex;
//                         electricityIndex = newElectricityIndex;
//                         detail = {
//                             id: uuidv4(),
//                             bill_id: billRoom.id,
//                             service_id: roomServiceItem.service_id,
//                             name: service.name,
//                             amount: electricityAmount,
//                             unit_price: service.unit_price || 0,
//                             total_price: service.unit_price ? service.unit_price * electricityAmount : 0,
//                             created_by: room.created_by,
//                             updated_by: room.updated_by,
//                         };
//                         break;
//                 }

//                 if (detail) {
//                     billRoom.amount += detail.total_price;

//                     console.log(
//                         `Room ${room.id} - month ${month} - current amount: ${billRoom.amount} - service: ${detail.name}`
//                     );

//                     billDetails.push(detail);
//                 }
//             }

//             // Write bill to a file
//             fs.writeFileSync(path.join(billsDir, `${billRoom.id}.json`), JSON.stringify(billRoom, null, 4));

//             // Write bill details to a file
//             fs.writeFileSync(path.join(billDetailsDir, `${billRoom.id}.json`), JSON.stringify(billDetails, null, 4));
//         }
//     }
// })();

// merge all bills file in bills folder into a single array
(async () => {
    const billsData: Bill[] = [];
    const billDetailsData: BillDetail[] = [];
    const billsFolder = __dirname + "/data/bills";
    const billsFiles = fs.readdirSync(billsFolder);
    const billDetailsFolder = __dirname + "/data/bill_details";
    const billDetailsFiles = fs.readdirSync(billDetailsFolder);

    for (const file of billsFiles) {
        const data = JSON.parse(fs.readFileSync(billsFolder + "/" + file, "utf-8")) as Bill;
        billsData.push(data);
    }

    for (const file of billDetailsFiles) {
        const data = JSON.parse(fs.readFileSync(billDetailsFolder + "/" + file, "utf-8")) as BillDetail[];
        billDetailsData.push(...data);
    }

    console.log("🚀 ~ seed ~ billsData:", billsData.length);
    console.log("🚀 ~ seed ~ billDetailsData:", billDetailsData.length);

    fs.writeFile(__dirname + "/data/bills.json", JSON.stringify(billsData, null, 4), (err) => {
        if (err) {
            console.error(err);
        }

        console.log("Bills generated!");
    });

    fs.writeFile(__dirname + "/data/billDetails.json", JSON.stringify(billDetailsData, null, 4), (err) => {
        if (err) {
            console.error(err);
        }

        console.log("Bill details generated!");
    });
})();
