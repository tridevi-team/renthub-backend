import { BillStatus, EquipmentStatus, EquipmentType, RoomStatus, ServiceTypes } from "../src/enums";
import { Permissions } from "../src/interfaces";

export interface User {
    id: string;
    email: string;
    password: string;
    full_name: string;
    gender: string;
    phone_number: string;
    address: {
        city: string;
        district: string;
        ward: string;
        street: string;
    };
    birthday: Date | string;
    role: string;
    type: string;
    status: number;
    verify: boolean;
    first_login: number;
}

export interface City {
    name: string;
    code: number;
    division_type: string;
    phone_code: number;
    districts: Array<District>;
}
export interface District {
    name: string;
    code: number;
    codename: string;
    division_type: string;
    short_codename: string;
    wards: Array<Ward>;
}
export interface Ward {
    name: string;
    code: number;
    codename: string;
    division_type: string;
    short_codename: string;
}
export interface House {
    id: string;
    name: string;
    contract_default: null | string;
    description: string;
    collection_cycle: number;
    invoice_date: number;
    num_collect_days: number;
    status: number;
    created_by: string;
    updated_by: string;
    address: {
        city: string;
        district: string;
        ward: string;
        street: string;
    };
}
export interface Floor {
    id: string;
    house_id: string;
    name: string;
    description: string;
    created_by: string;
    updated_by?: string;
}
export interface Room {
    id: string;
    floor_id: string;
    name: string;
    max_renters: number;
    room_area: number;
    price: number;
    description: string;
    status: RoomStatus;
    created_by: string;
    updated_by: string;
}
export interface RoomService {
    id: string;
    room_id: string;
    service_id: string;
    quantity: number;
    start_index: number | null;
    description: string;
    created_by: string;
    updated_by: string;
}
export interface RoomImage {
    id: string;
    room_id: string;
    image_url: string;
    description: string;
    created_by: string;
}
export interface Service {
    id: string;
    house_id?: string;
    name: string;
    unit_price?: number;
    type: ServiceTypes;
    description: string;
    created_by?: string;
    updated_by?: string;
}
export interface Service {
    id: string;
    house_id?: string;
    name: string;
    unit_price?: number;
    type: ServiceTypes;
    description: string;
    created_by?: string;
    updated_by?: string;
}
export interface Roles {
    id: string;
    house_id: string;
    name: string;
    permissions: Permissions;
    description: string;
    status: boolean;
    created_by: string;
    updated_by: string;
}
export interface PaymentMethod {
    id: string;
    house_id: string;
    name: string;
    account_number: string;
    bank_name: string;
    status: boolean;
    description: string;
    is_default: boolean;
    created_by: string;
    updated_by: string;
}
export interface Renter {
    id: string;
    room_id: string;
    name: string;
    citizen_id: string;
    birthday: Date | string;
    gender: "male" | "female" | "other";
    phone_number: string;
    email: string;
    address: {
        city: string;
        district: string;
        ward: string;
        street: string;
    };
    temp_reg: boolean;
    move_in_date: Date | string;
    represent: boolean;
    note?: string;
    created_by: string;
    updated_by: string;
}
export interface Bill {
    id: string;
    room_id: string;
    payment_method_id?: string | null;
    title: string;
    amount: number;
    payment_date: Date | null;
    status: BillStatus;
    created_by: string;
    updated_by: string;
}
export interface BillDetail {
    id: string;
    bill_id: string;
    service_id: string | null;
    name: string;
    old_value?: number | null;
    new_value?: number;
    amount: number;
    unit_price: number;
    total_price: number;
    description?: string;
    created_by: string;
    updated_by: string;
}
export interface Issue {
    id: string;
    house_id: string;
    floor_id: string;
    room_id: string;
    equipment_id: string;
    title: string;
    content: string;
    status: boolean;
    description: string;
    files: [image: string[], video: string[], file: string[]];
    assign_to: string;
    created_by: string;
    updated_by: string;
}
export interface Equipment {
    id: string;
    house_id: string;
    floor_id?: string;
    room_id?: string;
    code: string;
    name: string;
    status: EquipmentStatus;
    shared_type: EquipmentType;
    description: string;
    created_by: string;
    updated_by: string;
}
