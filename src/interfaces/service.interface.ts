import { ServiceTypes } from "@enums";

export interface RoomServiceInfo {
    serviceId: string;
    quantity?: number;
    startIndex?: number;
    description?: string;
}

export interface ServiceContractInfo {
    id: string;
    name: string;
    quantity: number;
    startIndex?: number;
    type: ServiceTypes;
    unitPrice: number;
}