import { BillStatus, colorPalette, ContractStatus, EquipmentStatus, IssueStatus, RoomStatus } from "@enums";
import { DateRange } from "@interfaces";
import { BillDetails, Bills, Equipment, Issues, RoomContracts, Rooms } from "@models";
import { createSlug } from "@utils";

class StatisticalService {
    private static parseBillObject(bills) {
        const status = Object.values(BillStatus);
        let total = 0;
        let totalPrice = 0;
        const data = status.map((item) => {
            const count = bills.filter((i) => i.status === item)[0]?.count || 0;
            const price = bills.filter((i) => i.status === item)[0]?.totalPrice || 0;
            total += count;
            totalPrice += price;

            return {
                status: item,
                count,
                totalPrice: price,
            };
        });

        return [
            ...data,
            {
                status: "ALL",
                count: total,
                totalPrice,
            },
        ];
    }

    private static parseIssueObject(issues) {
        const status = Object.values(IssueStatus);
        let total = 0;
        const data = status.map((item) => {
            const count = issues.filter((i) => i.status === item)[0]?.count || 0;
            total += count;

            return {
                status: item,
                count,
            };
        });

        return [
            ...data,
            {
                status: "ALL",
                count: total,
            },
        ];
    }

    private static parseRoomObject(rooms) {
        const status = Object.values(RoomStatus);
        let total = 0;
        const data = status.map((item) => {
            const count = rooms.filter((i) => i.status === item)[0]?.count || 0;
            total += count;

            return {
                status: item,
                count,
            };
        });

        return [
            ...data,
            {
                status: "ALL",
                count: total,
            },
        ];
    }

    private static parseContractObject(contracts) {
        const status = Object.values(ContractStatus);
        let total = 0;
        const data = status.map((item) => {
            const count = contracts.filter((i) => i.status === item)[0]?.count || 0;
            total += count;

            return {
                status: item,
                count,
            };
        });

        return [
            ...data,
            {
                status: "ALL",
                count: total,
            },
        ];
    }

    private static parseEquipmentObject(equipment: any) {
        const status = Object.values(EquipmentStatus);
        let total = 0;
        const data = status.map((item) => {
            const count = equipment.filter((i) => i.status === item)[0]?.count || 0;
            total += count;

            return {
                status: item,
                count,
            };
        });

        return [
            ...data,
            {
                status: "ALL",
                count: total,
            },
        ];
    }

    static async countBillsByHouse(
        houseId: string,
        time: {
            startDate?: string;
            endDate?: string;
        } = {}
    ) {
        const query = Bills.query()
            .join("rooms", "bills.roomId", "rooms.id")
            .join("house_floors", "rooms.floor_id", "house_floors.id")
            .where("house_floors.house_id", houseId);

        if (time.startDate || time.endDate) {
            query.whereRaw(
                `STR_TO_DATE(
                CONCAT(
                    SUBSTRING_INDEX(SUBSTRING_INDEX(bills.title, 'tháng ', -1), ' - ', 1), '-',
                    SUBSTRING_INDEX(bills.title, ' - ', -1), '-01'
                ), '%m-%Y-%d'
            ) BETWEEN ? AND ?`,
                [time.startDate || "1900-01-01", time.endDate || "2100-12-31"]
            );
        }

        await query
            .select("bills.status")
            .count("bills.status as count")
            .sum("bills.amount as totalPrice")
            .groupBy("bills.status");

        const result = await query;

        return StatisticalService.parseBillObject(result);
    }

    static async countBillByRoom(roomId: string, time: { startDate?: string; endDate?: string }) {
        const query = Bills.query().where("bills.roomId", roomId);

        if (time.startDate || time.endDate) {
            query.whereRaw(
                `STR_TO_DATE(
                CONCAT(
                    SUBSTRING_INDEX(SUBSTRING_INDEX(bills.title, 'tháng ', -1), ' - ', 1), '-',
                    SUBSTRING_INDEX(bills.title, ' - ', -1), '-01'
                ), '%m-%Y-%d'
            ) BETWEEN ? AND ?`,
                [time.startDate || "1900-01-01", time.endDate || "2100-12-31"]
            );
        }

        await query
            .select("bills.status")
            .count("bills.status as count")
            .sum("bills.amount as totalPrice")
            .groupBy("bills.status");

        const result = await query;

        return StatisticalService.parseBillObject(result);
    }

    static async countBillByRenter(renterId: string, time: DateRange = {}) {
        const query = Bills.query().whereILike("renterIds", renterId);

        if (time.startDate || time.endDate) {
            query.whereRaw(
                `STR_TO_DATE(
                CONCAT(
                    SUBSTRING_INDEX(SUBSTRING_INDEX(bills.title, 'tháng ', -1), ' - ', 1), '-',
                    SUBSTRING_INDEX(bills.title, ' - ', -1), '-01'
                ), '%m-%Y-%d'
            ) BETWEEN ? AND ?`,
                [time.startDate || "1900-01-01", time.endDate || "2100-12-31"]
            );
        }

        await query
            .select("bills.status")
            .count("bills.status as count")
            .sum("bills.amount as totalPrice")
            .groupBy("bills.status");

        const result = await query;

        return StatisticalService.parseBillObject(result);
    }

    static async countIssuesByHouse(houseId: string, time: DateRange = {}) {
        const query = Issues.query().where("house_id", houseId);

        if (time.startDate) {
            query.where("created_at", ">=", time.startDate);
        }

        if (time.endDate) {
            query.where("created_at", "<=", time.endDate);
        }

        await query.select("status").count("status as count").groupBy("status");

        const result = await query;

        return StatisticalService.parseIssueObject(result);
    }

    static async countIssuesByFloor(floorId: string, time: DateRange = {}) {
        const query = Issues.query().where("floor_id", floorId);

        if (time.startDate) {
            query.where("created_at", ">=", time.startDate);
        }

        if (time.endDate) {
            query.where("created_at", "<=", time.endDate);
        }

        await query.select("status").count("status as count").groupBy("status");

        const result = await query;

        return StatisticalService.parseIssueObject(result);
    }

    static async countIssuesByRoom(roomId: string, time: DateRange = {}) {
        const query = Issues.query().where("room_id", roomId);

        if (time.startDate) {
            query.where("created_at", ">=", time.startDate);
        }

        if (time.endDate) {
            query.where("created_at", "<=", time.endDate);
        }

        await query.select("status").count("status as count").groupBy("status");

        const result = await query;

        return StatisticalService.parseIssueObject(result);
    }

    static async countRoomsByHouse(houseId: string) {
        const query = Rooms.query()
            .join("house_floors", "rooms.floor_id", "house_floors.id")
            .where("house_floors.house_id", houseId);

        await query.count("rooms.id as count").groupBy("rooms.status").select("rooms.status");

        const result = await query;

        return StatisticalService.parseRoomObject(result);
    }

    static async countRoomsByFloor(floorId: string) {
        const query = Rooms.query().where("floor_id", floorId);

        await query.count("rooms.id as count").groupBy("rooms.status").select("rooms.status");

        const result = await query;

        return StatisticalService.parseRoomObject(result);
    }

    static async countContractsByHouse(houseId: string, time: DateRange = {}) {
        const query = RoomContracts.query()
            .join("rooms", "room_contracts.room_id", "rooms.id")
            .join("house_floors", "rooms.floor_id", "house_floors.id")
            .where("house_floors.house_id", houseId);

        // both rental_start_date and rental_end_date are in the range
        if (time.startDate && time.endDate) {
            query.whereBetween("rental_start_date", [time.startDate, time.endDate]);
            query.whereBetween("rental_end_date", [time.startDate, time.endDate]);
        }
        // rental_start_date is in the range
        else if (time.startDate) {
            query.where("rental_start_date", ">=", time.startDate);
        }

        // rental_end_date is in the range
        if (!time.startDate && time.endDate) {
            query.where("rental_end_date", "<=", time.endDate);
        }

        await query
            .count("room_contracts.id as count")
            .groupBy("room_contracts.status")
            .select("room_contracts.status");

        const result = await query;

        return StatisticalService.parseContractObject(result);
    }

    static async countContractsCreatedToday(houseId: string) {
        const query = RoomContracts.query()
            .join("rooms", "room_contracts.room_id", "rooms.id")
            .join("house_floors", "rooms.floor_id", "house_floors.id")
            .where("house_floors.house_id", houseId)
            .whereRaw("DATE(room_contracts.created_at) = CURDATE()");

        await query
            .count("room_contracts.id as count")
            .groupBy("room_contracts.status")
            .select("room_contracts.status");

        const result = await query;

        return StatisticalService.parseContractObject(result);
    }

    static async countContractByRoom(roomId: string, time: DateRange = {}) {
        const query = RoomContracts.query().where("room_id", roomId);

        if (time.startDate && time.endDate) {
            query.whereBetween("rental_start_date", [time.startDate, time.endDate]);
            query.whereBetween("rental_end_date", [time.startDate, time.endDate]);
        } else if (time.startDate) {
            query.where("rental_start_date", ">=", time.startDate);
        } else if (time.endDate) {
            query.where("rental_end_date", "<=", time.endDate);
        }

        await query.count("id as count").groupBy("status").select("status");

        const result = await query;

        return StatisticalService.parseContractObject(result);
    }

    static async countContractByRenter(renterId: string, time: DateRange = {}) {
        const query = RoomContracts.query().whereILike("renterIds", `%${renterId}%`);

        if (time.startDate) {
            query.where("rental_start_date", ">=", time.startDate);
        }

        if (time.endDate) {
            query.where("rental_end_date", "<=", time.endDate);
        }

        await query.count("id as count").groupBy("status").select("status");

        const result = await query;

        return StatisticalService.parseContractObject(result);
    }

    static async countEquipment(data: { houseId?: string; floorId?: string; roomId?: string }) {
        const query = Equipment.query().where((builder) => {
            if (data.houseId) {
                builder.where("house_id", data.houseId);
            }

            if (data.floorId) {
                builder.where("floor_id", data.floorId);
            }

            if (data.roomId) {
                builder.where("room_id", data.roomId);
            }
        });

        await query.count("id as count").groupBy("status").select("status");

        const result = await query;

        return StatisticalService.parseEquipmentObject(result);
    }

    static async pieChartServiceConsumption(houseId: string, time: DateRange = {}) {
        const query = BillDetails.query()
            .join("bills", "bill_details.bill_id", "bills.id")
            .join("rooms", "bills.roomId", "rooms.id")
            .join("house_floors", "rooms.floor_id", "house_floors.id")
            .where("house_floors.house_id", houseId)
            .sum("bill_details.total_price as totalPrice")
            .select("bill_details.name")
            .groupBy("bill_details.name");

        // search base on title
        if (time.startDate || time.endDate) {
            query.whereRaw(
                `STR_TO_DATE(
                CONCAT(
                    SUBSTRING_INDEX(SUBSTRING_INDEX(bills.title, 'tháng ', -1), ' - ', 1), '-',
                    SUBSTRING_INDEX(bills.title, ' - ', -1), '-01'
                ), '%m-%Y-%d'
            ) BETWEEN ? AND ?`,
                [time.startDate || "1900-01-01", time.endDate || "2100-12-31"]
            );
        }

        const result = await query;

        return result.map((item) => {
            return {
                name: item.name,
                totalPrice: Number(item.totalPrice),
            };
        });
    }

    static async barChartServiceConsumption(houseId: string, time: DateRange = {}) {
        // it will return the total price of each service in each month
        const query = BillDetails.query()
            .join("bills", "bill_details.bill_id", "bills.id")
            .join("rooms", "bills.roomId", "rooms.id")
            .join("house_floors", "rooms.floor_id", "house_floors.id")
            .where("house_floors.house_id", houseId)
            // .whereNot("bill_details.service_id", null)
            .sum("bill_details.total_price as totalPrice")
            .select(
                "bill_details.name",
                "bills.title",
                BillDetails.raw(`SUBSTRING_INDEX(SUBSTRING_INDEX(bills.title, 'tháng ', -1), ' - ', 1) as month`),
                BillDetails.raw(`SUBSTRING_INDEX(bills.title, ' - ', -1) as year`)
            )
            .groupBy("bill_details.name", "bills.title", "month", "year")
            .orderBy("bills.title", "asc");

        // Search based on title with time range
        if (time.startDate || time.endDate) {
            query.whereRaw(
                `STR_TO_DATE(
            CONCAT(
                SUBSTRING_INDEX(SUBSTRING_INDEX(bills.title, 'tháng ', -1), ' - ', 1), '-',
                SUBSTRING_INDEX(bills.title, ' - ', -1), '-01'
            ), '%m-%Y-%d'
        ) BETWEEN ? AND ?`,
                [time.startDate || "1900-01-01", time.endDate || "2100-12-31"]
            );
        }

        const result = await query;

        const months = new Set();

        result.forEach((item) => {
            months.add(item.month + "/" + item.year);
        });

        // sort set
        const monthsArray = Array.from(months).sort((a: unknown, b: unknown) => {
            const [monthA, yearA] = (a as string).split("/");
            const [monthB, yearB] = (b as string).split("/");

            if (yearA === yearB) {
                return Number(monthA) - Number(monthB);
            }

            return Number(yearA) - Number(yearB);
        });

        const config = {};

        const data = monthsArray.map((month) => {
            const monthData = result.filter((item) => {
                return item.month + "/" + item.year === month;
            });

            const obj = {
                month,
            };

            monthData.forEach((item) => {
                const key = createSlug(item.name.toLowerCase());
                obj[key] = Number(item.totalPrice);
                const color = colorPalette[monthData.indexOf(item) % colorPalette.length];

                config[key] = {
                    label: item.name,
                    color: color,
                };
            });

            return obj;
        });

        return { data, config };
    }

    static async barChartTurnover(houseId: string, time: DateRange = {}) {
        // it will return the total price of bills in each month
        const query = Bills.query()
            .join("rooms", "bills.roomId", "rooms.id")
            .join("house_floors", "rooms.floor_id", "house_floors.id")
            .where("house_floors.house_id", houseId)
            .where("bills.status", BillStatus.PAID)
            .sum("bills.amount as totalPrice")
            .select(
                "bills.title",
                BillDetails.raw(`SUBSTRING_INDEX(SUBSTRING_INDEX(bills.title, 'tháng ', -1), ' - ', 1) as month`),
                BillDetails.raw(`SUBSTRING_INDEX(bills.title, ' - ', -1) as year`)
            )
            .groupBy("bills.title", "month", "year")
            .orderBy("bills.title", "asc");

        // Search based on title with time range
        if (time.startDate || time.endDate) {
            const currentYear = new Date().getFullYear();
            query.whereRaw(
                `STR_TO_DATE(
            CONCAT(
                SUBSTRING_INDEX(SUBSTRING_INDEX(bills.title, 'tháng ', -1), ' - ', 1), '-',
                SUBSTRING_INDEX(bills.title, ' - ', -1), '-01'
            ), '%m-%Y-%d'
        ) BETWEEN ? AND ?`,
                [time.startDate || currentYear + "-01-01", time.endDate || currentYear + "-12-31"]
            );
        }

        const result = await query;

        const months = new Set();

        result.forEach((item) => {
            months.add(item.month + "/" + item.year);
        });

        // sort set
        const monthsArray = Array.from(months).sort((a: unknown, b: unknown) => {
            const [monthA, yearA] = (a as string).split("/");
            const [monthB, yearB] = (b as string).split("/");

            if (yearA === yearB) {
                return Number(monthA) - Number(monthB);
            }

            return Number(yearA) - Number(yearB);
        });

        const data = monthsArray.map((month) => {
            const monthData = result.filter((item) => {
                return item.month + "/" + item.year === month;
            });

            const obj = {
                month,
                totalPrice: 0,
            };

            monthData.forEach((item) => {
                obj.totalPrice = Number(item.totalPrice);
            });

            return obj;
        });

        return data;
    }

    static async barChartTurnoverByRoom(roomId: string, time: DateRange = {}) {
        console.log("🚀 ~ StatisticalService ~ barChartTurnoverByRoom ~ time:", time)
        // it will return the total price of bills in each month
        const query = Bills.query()
            .where("bills.roomId", roomId)
            // .where("bills.status", BillStatus.PAID)
            .sum("bills.amount as totalPrice")
            .select(
                "bills.title",
                BillDetails.raw(`SUBSTRING_INDEX(SUBSTRING_INDEX(bills.title, 'tháng ', -1), ' - ', 1) as month`),
                BillDetails.raw(`SUBSTRING_INDEX(bills.title, ' - ', -1) as year`)
            )
            .groupBy("bills.title", "month", "year")
            .orderBy("bills.title", "asc");

        // Search based on title with time range
        if (time.startDate || time.endDate) {
            const currentYear = new Date().getFullYear();
            query.whereRaw(
                `STR_TO_DATE(
            CONCAT(
                SUBSTRING_INDEX(SUBSTRING_INDEX(bills.title, 'tháng ', -1), ' - ', 1), '-',
                SUBSTRING_INDEX(bills.title, ' - ', -1), '-01'
            ), '%m-%Y-%d'
        ) BETWEEN ? AND ?`,
                [time.startDate || currentYear + "-01-01", time.endDate || currentYear + "-12-31"]
            );
        }

        const result = await query;
        
        const months = new Set();

        result.forEach((item) => {
            months.add(item.month + "/" + item.year);
        });

        // sort set
        const monthsArray = Array.from(months).sort((a: unknown, b: unknown) => {
            const [monthA, yearA] = (a as string).split("/");
            const [monthB, yearB] = (b as string).split("/");

            if (yearA === yearB) {
                return Number(monthA) - Number(monthB);
            }

            return Number(yearA) - Number(yearB);
        });

        const data = monthsArray.map((month) => {
            const monthData = result.filter((item) => {
                return item.month + "/" + item.year === month;
            });

            const obj = {
                month,
                totalPrice: 0,
            };

            monthData.forEach((item) => {
                obj.totalPrice = Number(item.totalPrice);
            });

            return obj;
        });

        return data;
    }

    static async barChartByBillStatus(houseId: string, time: DateRange = {}) {
        const query = Bills.query()
            .join("rooms", "bills.roomId", "rooms.id")
            .join("house_floors", "rooms.floor_id", "house_floors.id")
            .where("house_floors.house_id", houseId)
            .sum("bills.amount as totalPrice")
            .select(
                "bills.title",
                "bills.status",
                BillDetails.raw(`SUBSTRING_INDEX(SUBSTRING_INDEX(bills.title, 'tháng ', -1), ' - ', 1) as month`),
                BillDetails.raw(`SUBSTRING_INDEX(bills.title, ' - ', -1) as year`)
            )
            .groupBy("bills.title", "bills.status", "month", "year")
            .orderBy("bills.title", "asc");

        // Search based on title with time range
        if (time.startDate || time.endDate) {
            const currentYear = new Date().getFullYear();
            query.whereRaw(
                `STR_TO_DATE(
            CONCAT(
                SUBSTRING_INDEX(SUBSTRING_INDEX(bills.title, 'tháng ', -1), ' - ', 1), '-',
                SUBSTRING_INDEX(bills.title, ' - ', -1), '-01'
            ), '%m-%Y-%d'
        ) BETWEEN ? AND ?`,
                [time.startDate || currentYear + "-01-01", time.endDate || currentYear + "-12-31"]
            );
        }

        const result = await query;

        const months = new Set();

        result.forEach((item) => {
            months.add(item.month + "/" + item.year);
        });

        // sort set
        const monthsArray = Array.from(months).sort((a: unknown, b: unknown) => {
            const [monthA, yearA] = (a as string).split("/");
            const [monthB, yearB] = (b as string).split("/");

            if (yearA === yearB) {
                return Number(monthA) - Number(monthB);
            }

            return Number(yearA) - Number(yearB);
        });

        const config = {};

        const chart = monthsArray.map((month) => {
            const monthData = result.filter((item) => {
                return item.month + "/" + item.year === month;
            });

            const obj = {};
            obj["month"] = month;
            monthData.forEach((item) => {
                const key = createSlug(item.status.toLowerCase());
                obj[key] = Number(item.totalPrice);
                const color = colorPalette[monthData.indexOf(item) % colorPalette.length];

                config[key] = {
                    label: item.status,
                    color: color,
                };
            });

            return obj;
        });

        return { chart, config };
    }
}

export default StatisticalService;
