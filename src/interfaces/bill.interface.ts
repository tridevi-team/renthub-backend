export interface BillInfo {
    roomId: string;
    paymentMethodId?: string;
    title: string;
    amount?: number;
    paymentDate?: string;
    date: {
        from: string;
        to: string;
    };
    payosRequest?: object;
    payosResponse?: object;
    createdBy?: string;
    updatedBy?: string;
}

export interface BillUpdate {
    roomId?: string;
    paymentMethodId?: string;
    title?: string;
    amount?: number;
    paymentDate?: string;
    date?: {
        from: string;
        to: string;
    };
    payosRequest?: object;
    payosResponse?: object;
    createdBy?: string;
    updatedBy?: string;
}

export interface BillDetailRequest {
    billId: string;
    serviceId?: string;
    name?: string;
    oldValue?: number;
    newValue?: number;
    amount: number;
    unitPrice: number;
    totalPrice: number;
    description?: string;
    createdBy?: string;
    updatedBy?: string;
}
