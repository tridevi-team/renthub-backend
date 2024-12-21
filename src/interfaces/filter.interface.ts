import { Operator } from "../enums";
import { Pagination } from "./pagination.interface";

export interface Filter {
    filter?: {
        field: string;
        operator: Operator;
        value: string | number;
    }[];
    sort?: {
        field: string;
        direction: "asc" | "desc";
    }[];
    pagination: Pagination;
}
