import express from "express";
import NotificationController from "../controllers/notification.controller";
import { authentication, handleErrors } from "../middlewares";
import { notificationValidator } from "../middlewares/validator";

const notificationRouter = express.Router();

notificationRouter.post(
    "/create",
    authentication,
    notificationValidator.create,
    handleErrors,
    NotificationController.createNotification
);

notificationRouter.get("/list", authentication, NotificationController.getNotifications);

notificationRouter.get("/:id/details", authentication, NotificationController.getNotificationDetails);

notificationRouter.get("/count", authentication, NotificationController.getCount);

notificationRouter.put(
    "/update",
    authentication,
    notificationValidator.ids,
    handleErrors,
    notificationValidator.status,
    handleErrors,
    NotificationController.updateStatus
);

notificationRouter.delete(
    "/delete",
    authentication,
    notificationValidator.ids,
    handleErrors,
    NotificationController.deleteNotification
);

export default notificationRouter;
