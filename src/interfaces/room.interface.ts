export interface Room {
    name: string;
    maxRenters?: number;
    roomArea?: number;
    floorId: string;
    services?: string[];
    images?: string[];
    price: number;
    description?: string;
    status?: string;
    createdBy?: string;
    updatedBy?: string;
}
