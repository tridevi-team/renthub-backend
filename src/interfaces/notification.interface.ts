export interface NotificationRequest {
    title: string;
    content: string;
    imageUrl?: string;
    type: string;
    data: {
        [key: string]: any;
    };
    recipients: string[];
    createdBy?: string;
}
