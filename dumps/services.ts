import { ServiceTypes } from "@/src/enums";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { House, Service } from "./interface";

(async () => {
    const houses = JSON.parse(fs.readFileSync(__dirname + "/data/houses.json", "utf-8")) as House[];

    const services: Service[] = [];

    for (const house of houses) {
        const randomWaterType = Math.random() > 0.5 ? ServiceTypes.WATER_CONSUMPTION : ServiceTypes.PEOPLE;
        // required services
        const requiredServices: Service[] = [
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Dịch vụ điện",
                unit_price: Math.floor(Math.random() * 20) * 100 + 2000,
                type: ServiceTypes.ELECTRICITY_CONSUMPTION,
                description: "Dịch vụ điện",
                created_by: house.created_by,
                updated_by: house.created_by,
            },
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Dịch vụ nước",
                type: randomWaterType,
                unit_price:
                    randomWaterType === ServiceTypes.WATER_CONSUMPTION
                        ? Math.floor(Math.random() * 10) * 1000 + 28000
                        : Math.floor(Math.random() * 7) * 10000 + 70000,
                description: "Dịch vụ nước",
                created_by: house.created_by,
                updated_by: house.created_by,
            },
        ];

        // optional services
        const optionalServices: Service[] = [
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Dịch vụ wifi",
                type: ServiceTypes.ROOM,
                unit_price: Math.floor(Math.random() * 7) * 10000 + 70000,
                description: "Dịch vụ cung cấp wifi cho phòng",
                created_by: house.created_by,
                updated_by: house.created_by,
            },
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Dịch vụ vệ sinh",
                type: Math.random() > 0.5 ? ServiceTypes.ROOM : ServiceTypes.PEOPLE,
                unit_price: Math.floor(Math.random() * 10) * 1000 + 25000,
                description: "Dịch vụ vệ sinh chung",
                created_by: house.created_by,
                updated_by: house.created_by,
            },
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Máy giặt",
                type: ServiceTypes.ROOM,
                unit_price: Math.floor(Math.random() * 5) * 10000 + 50000,
                description: "Máy giặt",
                created_by: house.created_by,
                updated_by: house.created_by,
            },
            {
                id: uuidv4(),
                house_id: house.id,
                name: "Gửi xe",
                type: ServiceTypes.PEOPLE,
                unit_price: Math.floor(Math.random() * 8) * 10000 + 80000,
                description: "Dịch vụ gửi xe",
                created_by: house.created_by,
                updated_by: house.created_by,
            },
        ];
        services.push(...requiredServices);

        // add optional services
        const numOptionalServices = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numOptionalServices; i++) {
            services.push(optionalServices[i]);
        }
    }
    fs.writeFile("./dumps/data/services.json", JSON.stringify(services, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("File has been created");
    });
})();
