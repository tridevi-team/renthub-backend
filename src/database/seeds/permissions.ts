import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("permissions").del();

    // Inserts seed entries
    await knex("permissions").insert([
        { id: 1, name: "Create room", key: "CREATE_ROOM" },
        { id: 2, name: "Update room", key: "UPDATE_ROOM" },
        { id: 3, name: "Read room", key: "READ_ROOM" },
        { id: 4, name: "Delete room", key: "DELETE_ROOM" },
        { id: 5, name: "Create equipment", key: "CREATE_EQUIPMENT" },
        { id: 6, name: "Update equipment", key: "UPDATE_EQUIPMENT" },
        { id: 7, name: "Read equipment", key: "READ_EQUIPMENT" },
        { id: 8, name: "Delete equipment", key: "DELETE_EQUIPMENT" },
        { id: 9, name: "Create service", key: "CREATE_SERVICE" },
        { id: 10, name: "Update service", key: "UPDATE_SERVICE" },
        { id: 11, name: "Read service", key: "READ_SERVICE" },
        { id: 12, name: "Delete service", key: "DELETE_SERVICE" },
        { id: 13, name: "Create house", key: "CREATE_HOUSE" },
        { id: 14, name: "Update house", key: "UPDATE_HOUSE" },
        { id: 15, name: "Read house", key: "READ_HOUSE" },
        { id: 16, name: "Delete house", key: "DELETE_HOUSE" },
        { id: 17, name: "Create bill", key: "CREATE_BILL" },
        { id: 18, name: "Update bill", key: "UPDATE_BILL" },
        { id: 19, name: "Read bill", key: "READ_BILL" },
        { id: 20, name: "Delete bill", key: "DELETE_BILL" },
        { id: 21, name: "Create issue", key: "CREATE_ISSUE" },
        { id: 22, name: "Update issue", key: "UPDATE_ISSUE" },
        { id: 23, name: "Read issue", key: "READ_ISSUE" },
        { id: 24, name: "Delete issue", key: "DELETE_ISSUE" },
    ]);
}
