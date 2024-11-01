import { Action, messageResponse, Module } from "../enums";
import { HouseService, NotificationService, RenterService, UserService } from "../services";
import { ApiException, apiResponse, Exception } from "../utils";

class NotificationController {
    static async createNotification(req, res) {
        const { title, content, type, imageUrl, data, scope, ids } = req.body;
        const user = req.user;
        try {
            let recipients: string[] = [];
            if (scope === "all") {
                if (user.role !== "admin") throw new ApiException(messageResponse.UNAUTHORIZED, 401);
                const users = await UserService.getAllUsers();
                recipients = users.map((user) => user.id);
            } else if (scope === "house") {
                // check user has permission access house
                for (const id of ids) {
                    const isOwner = await HouseService.isOwner(user.id, id);
                    const isAccess = await HouseService.isAccessToResource(
                        user.id,
                        id,
                        Module.NOTIFICATION,
                        Action.CREATE
                    );

                    if (!isOwner && !isAccess) {
                        throw new ApiException(messageResponse.UNAUTHORIZED, 401);
                    }

                    const renters = await RenterService.listByHouse(id);
                    recipients = [...recipients, ...renters.map((renter) => renter.id)];
                }
                // get all users in house
            } else if (scope === "room") {
                // get all users in room
                for (const id of ids) {
                    const isOwner = await HouseService.isOwner(user.id, id);
                    const isAccess = await HouseService.isAccessToResource(
                        user.id,
                        id,
                        Module.NOTIFICATION,
                        Action.CREATE
                    );

                    if (!isOwner && !isAccess) {
                        throw new ApiException(messageResponse.UNAUTHORIZED, 401);
                    }

                    const renters = await RenterService.listByRoom(id);
                    recipients = [...recipients, ...renters.map((renter) => renter.id)];
                }
            } else if (scope === "user") {
                if (user.role !== "admin") throw new ApiException(messageResponse.UNAUTHORIZED, 401);
                recipients = ids;
            }

            // Create notification
            await NotificationService.create({
                title,
                content,
                type,
                data: data || {},
                imageUrl: imageUrl,
                recipients: recipients,
                createdBy: user.id,
            });

            return res.json(apiResponse(messageResponse.CREATE_NOTIFICATION_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getNotifications(req, res) {
        const user = req.user;
        const { filter = [], sort = [], pagination = {} } = req.query;
        try {
            const notifications = await NotificationService.getNotificationByUser(user.id, {
                filter,
                sort,
                pagination,
            });
            return res.json(apiResponse(messageResponse.GET_NOTIFICATION_LIST_SUCCESS, true, notifications));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getNotificationDetails(req, res) {
        const { id } = req.params;
        const user = req.user;
        try {
            const notification = await NotificationService.getNotificationDetails(id, user.id);
            return res.json(apiResponse(messageResponse.GET_NOTIFICATION_DETAILS_SUCCESS, true, notification));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getCount(req, res) {
        const user = req.user;
        try {
            const count = await NotificationService.getNotificationCount(user.id);
            return res.json(apiResponse(messageResponse.GET_NOTIFICATION_COUNT_SUCCESS, true, count));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateStatus(req, res) {
        const user = req.user;
        const { ids, status } = req.body;
        try {
            await NotificationService.updateStatus(ids, user.id, status);
            return res.json(apiResponse(messageResponse.UPDATE_NOTIFICATION_STATUS_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deleteNotification(req, res) {
        const { ids } = req.body;
        const user = req.user;
        try {
            await NotificationService.deleteNotifications(ids, user.id);
            return res.json(apiResponse(messageResponse.DELETE_NOTIFICATION_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default NotificationController;
