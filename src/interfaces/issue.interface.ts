import { IssueStatus } from "@enums";

export interface IssueRequestCreate {
    houseId: string;
    floorId?: string;
    roomId?: string;
    equipmentId?: string;
    title: string;
    content: string;
    status: IssueStatus;
    description: string;
    files?: object;
    assignTo?: string;
    createdBy: string;
}
export interface IssueRequestUpdate {
    houseId: string;
    floorId?: string;
    roomId?: string;
    equipmentId?: string;
    title: string;
    content: string;
    status: IssueStatus;
    description: string;
    files?: object;
    assignTo?: string;
    updatedBy?: string;
}
