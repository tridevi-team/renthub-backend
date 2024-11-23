import { RoomStatus, ServiceTypes } from "@/src/enums";
import { en, Faker, vi } from "@faker-js/faker";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Floor, Room, RoomImage, RoomService, Service } from "./interface";

const faker = new Faker({
    locale: [vi, en],
});

// (async () => {
//     const floors = JSON.parse(fs.readFileSync(__dirname + "/data/floors.json", "utf-8")) as Floor[];
//     const images = JSON.parse(fs.readFileSync(__dirname + "/data/images_dataset.json", "utf-8")) as string[];
//     const services = JSON.parse(fs.readFileSync(__dirname + "/data/services.json", "utf-8"));
//     const rooms: Room[] = [];
//     const roomImages: RoomImage[] = [];
//     const roomServices: RoomService[] = [];

//     for (const floor of floors) {
//         const numRooms = Math.floor(Math.random() * 3) + 4;
//         for (let i = 0; i < numRooms; i++) {
//             const status = Object.values(RoomStatus)[Math.floor(Math.random() * Object.values(RoomStatus).length)];
//             const maxRenters = Math.random() < 0.4 ? -1 : faker.number.int({ min: 1, max: 5 });
//             const floorNumber = floor.name.replace("Tầng ", "");
//             const roomName = floorNumber + (i < 9 ? "0" + (i + 1) : i + 1);
//             const roomInfo: Room = {
//                 id: uuidv4(),
//                 floor_id: floor.id,
//                 name: `Phòng ${roomName}`,
//                 description: faker.lorem.paragraph({
//                     min: 50,
//                     max: 100,
//                 }),
//                 room_area: faker.number.float({
//                     min: 10,
//                     max: 30,
//                 }),
//                 max_renters: maxRenters,
//                 price:
//                     Math.round(
//                         faker.number.float({
//                             min: 2_000_000,
//                             max: 6_000_000,
//                         }) / 100000
//                     ) * 100000,
//                 status: status,
//                 created_by: floor.created_by,
//                 updated_by: floor.created_by,
//             };

//             const numImages = Math.floor(Math.random() * 3) + 1;

//             for (let j = 0; j < numImages; j++) {
//                 // random in images_dataset.json
//                 const imageIndex = Math.floor(Math.random() * images.length);
//                 const imageUrl = images[imageIndex];
//                 const roomImage: RoomImage = {
//                     id: uuidv4(),
//                     room_id: roomInfo.id,
//                     image_url: imageUrl,
//                     description: faker.lorem.sentence(),
//                     created_by: floor.created_by,
//                 };
//                 roomImages.push(roomImage);
//             }
//             rooms.push(roomInfo);

//             const getServices = services.filter((service) => service.house_id === floor.house_id) as Service[];
//             for (const houseService of getServices) {
//                 const startIndex =
//                     houseService.type === ServiceTypes.ELECTRICITY_CONSUMPTION ||
//                     houseService.type === ServiceTypes.WATER_CONSUMPTION
//                         ? faker.number.int({
//                               min: 0,
//                               max: 10000,
//                           })
//                         : null;
//                 const roomService: RoomService = {
//                     id: uuidv4(),
//                     room_id: roomInfo.id,
//                     service_id: houseService.id,
//                     quantity: 1,
//                     start_index: startIndex,
//                     description: faker.lorem.sentence(),
//                     created_by: floor.created_by,
//                     updated_by: floor.created_by,
//                 };
//                 roomServices.push(roomService);
//             }
//         }
//     }

//     fs.writeFile(__dirname + "/data/rooms.json", JSON.stringify(rooms, null, 4), (err) => {
//         if (err) {
//             console.error(err);
//         }

//         console.log("Rooms generated!");
//     });

//     fs.writeFile(__dirname + "/data/roomImages.json", JSON.stringify(roomImages, null, 4), (err) => {
//         if (err) {
//             console.error(err);
//         }

//         console.log("Room images generated!");
//     });

//     fs.writeFile(__dirname + "/data/roomServices.json", JSON.stringify(roomServices, null, 4), (err) => {
//         if (err) {
//             console.error(err);
//         }

//         console.log("Room services generated!");
//     });
// })();

// (async()=>{
//     const rooms = JSON.parse(fs.readFileSync(__dirname + "/data/rooms.json", "utf-8")) as Room[];
//     console.log(rooms.length);
//     const availableRooms = rooms.filter((room) => room.status === RoomStatus.RENTED);
//     console.log(availableRooms[availableRooms.length - 1]);
// })()

(async()=>{
    const rooms = JSON.parse(fs.readFileSync(__dirname + "/data/roomImages.json", "utf-8")) as Room[];
    console.log(rooms.length);
})()