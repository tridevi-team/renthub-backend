export enum DepositStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    REFUNDED = "REFUNDED",
    DEDUCTED = "DEDUCTED",
    CANCELLED = "CANCELLED",
}

export enum ContractStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED",
    TERMINATED = "TERMINATED",
    HOLD = "HOLD",
}

export enum ApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}
