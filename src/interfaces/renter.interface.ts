import { Address } from "./address.interface";

export interface Renter {
    roomId?: string;
    name: string;
    citizenId?: string;
    birthday?: string;
    gender: string;
    email?: string;
    phoneNumber?: string;
    address?: string | Address;
    tempReg?: boolean;
    moveInDate: string;
    represent: boolean;
    note?: string;
    createdBy?: string;
    updatedBy?: string;
}
