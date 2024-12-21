import { check } from "express-validator";

const countValidator = [
    check("from").optional().isISO8601().withMessage("from must be a date"),
    check("to").optional().isISO8601().withMessage("to must be a date"),
    check("modules")
        .optional()
        .isArray()
        .withMessage("modules must be an array")
        .isIn(["bills", "issues", "rooms", "contracts", "equipment"])
        .withMessage("modules must be one of bills, issues, rooms, contracts, equipment"),
];

const chartValidator = [
    check("from").optional().isISO8601().withMessage("from must be a date"),
    check("to").optional().isISO8601().withMessage("to must be a date"),
    check("modules")
        .optional()
        .isArray()
        .withMessage("modules must be an array")
        .isIn(["pieChartConsumption", "barChartConsumption", "barChartTurnover", "barChartByBillStatus"])
        .withMessage(
            "modules must be one of pieChartConsumption, barChartConsumption, barChartTurnover, barChartByBillStatus"
        ),
];

const statisticalValidator = {
    countValidator,
    chartValidator,
};

export default statisticalValidator;
