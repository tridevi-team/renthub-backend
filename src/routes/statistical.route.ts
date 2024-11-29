import { StatisticalController } from "@/controllers";
import express from "express";

const statisticalRoute = express.Router();

statisticalRoute.get("/:houseId", StatisticalController.getStatisticalByHouse);

export default statisticalRoute;
