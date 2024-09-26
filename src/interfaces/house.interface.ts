import { Address } from ".";
import { ServiceTypes } from "../enums";

export interface HouseCreate {
    name: string;
    address: Address;
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
    status?: boolean;
    updatedBy?: string;
}

export interface CRUDPermissions {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
}

export interface Permissions {
    house: CRUDPermissions;
    role: CRUDPermissions;
    room: CRUDPermissions;
    service: CRUDPermissions;
    bill: CRUDPermissions;
    equipment: CRUDPermissions;
}

export interface Role {
    id?: string;
    houseId?: string;
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

export interface HouseFilter {
    keyword: string;
    limit: number;
    page: number;
    sortBy: "name" | "numOfBeds" | "numOfRenters" | "roomArea" | "price" | "street" | "ward" | "district" | "city";
    orderBy: "asc" | "desc";
    numOfBeds: number;
    address: Address;
    numOfRenters: number;
    roomArea: number;
    price: {
        from: number;
        to: number;
    };
}

export interface HouseServiceInfo {
    name: string;
    unitPrice: number;
    type: ServiceTypes;
    hasIndex?: boolean;
    description?: string;
    createdBy?: string;
    updatedBy?: string;
}
