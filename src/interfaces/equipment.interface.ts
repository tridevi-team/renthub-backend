import { EquipmentStatus } from "@enums";

export interface EquipmentInfo {
    houseId?: string;
    floorId?: string;
    roomId?: string;
    code: string;
    name: string;
    status: string;
    sharedType: string;
    description: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface EquipmentContractInfo {
    id: string;
    houseId: string;
    floorId: string;
    roomId: string;
    code: string;
    name: string;
    status: string;
    sharedType: EquipmentStatus;
}
