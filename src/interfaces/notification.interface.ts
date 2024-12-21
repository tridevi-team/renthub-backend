import { NotificationType } from "@enums";

export interface NotificationRequest {
    title: string;
    content: string;
    imageUrl?: string;
    type: NotificationType;
    data: {
        [key: string]: any;
    };
    recipients: string[];
    createdBy?: string;
}
