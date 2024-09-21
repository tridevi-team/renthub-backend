export interface HouseCreate {
    name: string;
    address: string;
    numOfFloors: number;
    numOfRoomsPerFloor: number;
    maxRenters: number;
    roomArea: number;
    roomPrice: number;
    description?: string;
    collectionCycle?: number;
    invoiceDate?: number;
    numCollectDays?: number;
    contractDefault?: string;
    status?: boolean;
    createdBy: string;
}

export interface HouseUpdate {
    name: string;
    address: string;
    description?: string;
    collectionCycle: number;
    invoiceDate: number;
    numCollectDays: number;
    contractDefault?: string;
    status: boolean;
}

export interface Permissions {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
}

export interface Role {
    id?: string;
    houseId?: string,
    name: string;
    permissions: {
        house: Permissions;
        role: Permissions;
        room: Permissions;
        service: Permissions;
        bill: Permissions;
        equipment: Permissions;
    };
    description?: string;
    status: boolean;
    createdBy?: string;
}
