enum HouseStatus {
    AVAILABLE = "AVAILABLE",
    RENTED = "RENTED",
    PENDING = "PENDING",
    DEPOSIT = "DEPOSIT",
}

enum HousePermissions {
    HOUSE_OWNER = "HOUSE_OWNER",
    HOUSE_DETAILS = "HOUSE_DETAILS",
    UPDATE_HOUSE = "UPDATE_HOUSE",
    DELETE_HOUSE = "DELETE_HOUSE",
    CREATE_ROOMS = "CREATE_ROOMS",
    READ_ROOMS = "READ_ROOMS",
    UPDATE_ROOMS = "UPDATE_ROOMS",
    DELETE_ROOMS = "DELETE_ROOMS",
    CREATE_BILLS = "CREATE_BILLS",
    READ_BILLS = "READ_BILLS",
    UPDATE_BILLS = "UPDATE_BILLS",
    DELETE_BILLS = "DELETE_BILLS",
    CREATE_SERVICES = "CREATE_SERVICES",
    READ_SERVICES = "READ_SERVICES",
    UPDATE_SERVICES = "UPDATE_SERVICES",
    DELETE_SERVICES = "DELETE_SERVICES",
    CREATE_EQUIPMENTS = "CREATE_EQUIPMENTS",
    READ_EQUIPMENTS = "READ_EQUIPMENTS",
    UPDATE_EQUIPMENTS = "UPDATE_EQUIPMENTS",
    DELETE_EQUIPMENTS = "DELETE_EQUIPMENTS",
}

export { HouseStatus, HousePermissions };
