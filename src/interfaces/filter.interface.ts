export interface StringFilter {
    eq?: string;
    ne?: string;
    cont?: string;
    ncont?: string;
    sw?: string;
    ew?: string;
    match?: string;
    nmatch?: string;
    in?: string;
    nin?: string;
}

export interface NumberFilter {
    eq?: number;
    ne?: number;
    gt?: number;
    gte?: number;
    lt?: number;
    lte?: number;
    in?: number;
    nin?: number;
}
