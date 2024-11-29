import { BatchResponse } from "firebase-admin/lib/messaging/messaging-api";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { raw, Transaction } from "objection";
import { firebaseAdmin, firebaseApp } from "../config/firebase.config";
import { EPagination, messageResponse, NotificationStatus } from "../enums";
import { Filter, NotificationRequest } from "../interfaces";
import { NotificationRecipients, Notifications } from "../models";
import { ApiException, filterHandler, sortingHandler } from "../utils";
import UserService from "./user.service";

class NotificationService {
    private static firebaseDb = getFirestore(firebaseApp);

    static async create(notification: NotificationRequest, trx?: Transaction) {
        if (!notification.createdBy) {
            const systemUser = await UserService.getSystemUser();
            notification.createdBy = systemUser.id;
        }
        await Notifications.query(trx).insertGraph({
            "#id": "notification",
            title: notification.title,
            content: notification.content,
            image_url: notification.imageUrl,
            type: notification.type,
            data: notification.data,
            created_by: notification.createdBy,
            recipients: notification.recipients.map((recipient) => ({
                "#id": "recipient",
                recipient_id: recipient,
            })),
        });

        // send notification to devices
        for (const recipient of notification.recipients) {
            await NotificationService.sendNotificationToDevices(recipient, notification);
        }
    }

    private static async sendNotificationToDevices(recipient: string, notification: NotificationRequest) {
        try {
            const collectionRef = collection(NotificationService.firebaseDb, "users", recipient, "devices");
            const getData = await getDocs(collectionRef);
            const fcmTokens = getData.docs.map((doc) => doc.data().FCM).filter((token) => token !== null);

            if (fcmTokens.length === 0) return;

            firebaseAdmin
                .messaging()
                .sendEachForMulticast({
                    tokens: fcmTokens,
                    notification: {
                        title: notification.title,
                        body: notification.content,
                        imageUrl: notification.imageUrl,
                    },
                    data: notification.data,
                    android: {
                        priority: "high",
                        notification: {
                            title: notification.title,
                            body: notification.content,
                            sticky: false,
                            imageUrl: notification.imageUrl,
                            clickAction: "FLUTTER_NOTIFICATION_CLICK",
                        },
                    },
                })
                .then((response: BatchResponse) => {
                    console.log("Successfully sent message:", response);
                })
                .catch((error) => {
                    console.log("Error sending message:", error);
                });
        } catch (err) {
            console.error(err);
        }
    }

    static async getNotificationByUser(userId: string, filterData?: Filter) {
        const {
            filter = [],
            sort = [],
            pagination = { page: EPagination.DEFAULT_PAGE, pageSize: EPagination.DEFAULT_LIMIT },
        } = filterData || {};

        let query = Notifications.query()
            .joinRelated("recipients(recipientIdAndStatus)")
            .where("recipients.recipient_id", userId)
            .select("notifications.*", "recipients.status")
            .orderBy("created_at", "desc")
            .orderBy("title", "desc");

        // filter
        query = filterHandler(query, filter);

        // sort
        query = sortingHandler(query, sort);

        const cloneQuery = query.clone();
        const total = await cloneQuery.resultSize();
        const totalPages = Math.ceil(total / pagination.pageSize);

        if (pagination.page !== -1 && pagination.pageSize !== -1) query.page(pagination.page - 1, pagination.pageSize);
        else query.page(0, total);

        const fetchData = await query;

        if (!total) throw new ApiException(messageResponse.NO_NOTIFICATIONS_FOUND, 404);

        return {
            ...fetchData,
            total,
            page: pagination.page,
            pageCount: totalPages,
            pageSize: pagination.pageSize,
        };
    }

    static async getNotificationCount(userId: string) {
        const query = await NotificationRecipients.query()
            .where("recipient_id", userId)
            .select(
                raw("count(if(status = ?, 1, NULL)) as unread", [NotificationStatus.UNREAD]),
                raw("count(if(status = ?, 1, NULL)) as `read`", [NotificationStatus.READ]),
                raw("count(if(status = ?, 1, NULL)) as archived", [NotificationStatus.ARCHIVED])
            )
            .count("notification_id as total")
            .first();

        return query;
    }

    static async getNotificationDetails(notificationId: string, userId: string) {
        const notification = await Notifications.query()
            .findById(notificationId)
            .joinRelated("recipients(statusOnly)")
            .where("recipient_id", userId);

        if (!notification) throw new ApiException(messageResponse.NOTIFICATION_NOT_FOUND, 404);

        return notification;
    }

    static async updateStatus(notificationIds: string[], userId: string, status: NotificationStatus) {
        const query = await NotificationRecipients.query()
            .patch({ status })
            .whereIn("notification_id", notificationIds)
            .andWhere("recipient_id", userId);

        return query;
    }

    static async deleteNotifications(notificationId: string[], userId: string) {
        const query = await NotificationRecipients.query()
            .delete()
            .whereIn("notification_id", notificationId)
            .andWhere("recipient_id", userId);

        return query;
    }
}

export default NotificationService;
