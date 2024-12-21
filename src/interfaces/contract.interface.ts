import { ContractStatus, DepositStatus } from "@enums";
import { Address, EquipmentContractInfo, RoomContractInfo, ServiceContractInfo } from "@interfaces";

export interface Information {
    fullName: string;
    citizenId: string;
    address: Address;
    phoneNumber: string;
    email?: string;
    birthday: string;
    dateOfIssue: string;
    placeOfIssue: string;
    gender: "male" | "female" | "other";
}

export interface ContractRequest {
    houseId: string;
    name: string;
    content: string;
    landlord: Information;
    isActive: boolean;
    createdBy?: string;
    updatedBy?: string;
}

export interface ContractUpdateRequest {
    houseId?: string;
    name?: string;
    content?: string;
    landlord?: Information;
    isActive?: boolean;
    createdBy?: string;
    updatedBy?: string;
}

export interface RoomContractRequest {
    roomId: string;
    contractId: string;
    landlord: Information;
    renter: Information;
    renterIds: string;
    content?: string;
    depositAmount: number;
    depositStatus: DepositStatus;
    depositDate: Date | string;
    depositRefund?: number;
    depositRefundDate?: string;
    rentalStartDate: string;
    rentalEndDate: string;
    room: any;
    services: ServiceContractInfo[];
    equipment: EquipmentContractInfo[];
    status: ContractStatus;
    createdBy: string;
    updatedBy: string;
}

export interface RoomContractUpdateRequest {
    roomId?: string;
    contractId?: string;
    landlord?: Information;
    renter?: Information;
    renterIds?: string[];
    depositAmount?: number;
    depositStatus?: DepositStatus;
    depositDate?: string;
    depositRefund?: number;
    depositRefundDate?: string;
    rentalStartDate?: string;
    rentalEndDate?: string;
    room?: RoomContractInfo;
    services?: ServiceContractInfo[];
    equipment?: EquipmentContractInfo[];
    status?: ContractStatus;
    updatedBy: string;
}

export interface RoomContractExtend {
    contractId: string;
    rentalStartDate: string;
    rentalEndDate: string;
    room?: any;
    services?: any;
    equipment?: any;
    landlord?: Information;
    renter?: Information;
}
