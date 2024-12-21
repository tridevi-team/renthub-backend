import { StatisticalController } from "@controllers";
import { authentication, handleErrors } from "@middlewares";
import { roomsValidator, statisticalValidator } from "@validator";
import houseValidator from "@validator/houses.validator";
import express from "express";

const statisticalRoute = express.Router();

statisticalRoute.get(
    "/:houseId/count",
    authentication,
    houseValidator.houseIdValidator,
    handleErrors,
    statisticalValidator.countValidator,
    handleErrors,
    StatisticalController.getStatisticalCountsByHouse
);

statisticalRoute.get(
    "/:houseId/chart",
    authentication,
    houseValidator.houseIdValidator,
    handleErrors,
    statisticalValidator.chartValidator,
    handleErrors,
    StatisticalController.getStatisticalChartByHouse
);

statisticalRoute.get(
    "/:roomId/room-chart",
    authentication,
    roomsValidator.roomId,
    handleErrors,
    StatisticalController.getStatisticalChartByRoom
);

export default statisticalRoute;
