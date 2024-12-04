import { RoomServiceInfo } from "@interfaces";

export interface Room {
    name: string;
    maxRenters?: number;
    roomArea?: number;
    floorId: string;
    services?: RoomServiceInfo[];
    images?: string[];
    price: number;
    description?: string;
    status?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface RoomContractInfo {
    id: string;
    name: string;
    area: number;
    price: number;
    maxRenters: number;
}
