import { Model } from "objection";
import { EPagination } from "../enums";
import { Pagination } from "../interfaces";

export const queryParser = async (req, res, next) => {
    const { filter = [], sorting = [], page, pageSize } = req.query;

    const pagination: Pagination = {
        page: page ? parseInt(page) : EPagination.DEFAULT_PAGE,
        pageSize: pageSize ? parseInt(pageSize) : EPagination.DEFAULT_LIMIT,
    };

    // Ensure filter is an array and parse items as JSON if necessary
    const parsedFilter = Array.isArray(filter)
        ? filter.map((item) => (typeof item === "string" ? JSON.parse(item) : item))
        : filter;

    // Ensure sorting is an array and parse items as JSON if necessary
    const parsedSorting = Array.isArray(sorting)
        ? sorting.map((item) => (typeof item === "string" ? JSON.parse(item) : item))
        : sorting;

    if (Array.isArray(filter) && filter.length > 0) {
        for (const filterItem of filter) {
            if (typeof filterItem === "object" && "field" in filterItem) {
                if (typeof filterItem.field === "string") {
                    const [tableName, initialColumnName] = filterItem.field.split(".");
                    let columnName = initialColumnName;

                    const address = ["city", "district", "ward", "street"];
                    if (address.includes(columnName)) {
                        columnName = "address";
                    }

                    const checkColumn = await Model.knex().schema.hasColumn(tableName, columnName);
                    if (!checkColumn) {
                        return res.status(400).json({
                            message: "Invalid filter field column " + filterItem.field,
                        });
                    }
                }
            }
        }
    }
    req.query = { filter: parsedFilter, sorting: parsedSorting, pagination };
    next();
};
