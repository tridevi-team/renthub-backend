import { Address } from "./";

export interface UserCreate {
    email: string;
    fullName: string;
    password: string;
    phoneNumber: string;
    birthday: string;
    gender: string;
    address: string;
}

export interface UserUpdate {
    fullName: string;
    phoneNumber: string;
    gender?: "male" | "female" | "other";
    birthday: string;
    address?: Address;
}
