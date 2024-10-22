import type { Address } from ".";
import type { ServiceTypes } from "../enums";

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
    payment: CRUDPermissions;
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

export interface HouseServiceInfo {
    name: string;
    unitPrice: number;
    type: ServiceTypes;
    hasIndex?: boolean;
    description?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface ResourceIdentifier {
    houseId?: string;
    roomId?: string;
    floorId?: string;
    equipmentId?: string;
    paymentId?: string;
    billId?: string;
    serviceId?: string;
    issueId?: string;
    renterId?: string;
    roleId?: string;
}
