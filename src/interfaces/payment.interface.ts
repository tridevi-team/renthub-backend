export interface PaymentRequest {
    houseId: string;
    name: string;
    accountNumber: string;
    bankName?: string;
    status: string;
    description?: string;
    isDefault: boolean;
    payosClientId?: string;
    payosApiKey?: string;
    payosChecksum?: string;
    createdBy?: string;
    updatedBy?: string;
}
