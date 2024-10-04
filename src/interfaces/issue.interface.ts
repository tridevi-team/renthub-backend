export interface IssueFilter {
    houseId?: string;
    roomId?: string;
    floorId?: string;
    equipmentId?: string;
    title?: string;
    content?: string;
    status?: string;
    description?: string;
    assignTo?: string;
}

export interface IssueRequest {
    houseId?: string;
    floorId?: string;
    roomId?: string;
    equipmentId?: string;
    title: string;
    content: string;
    status: string;
    description: string;
    files?: object;
    assignTo?: string;
    createdBy?: string;
}
