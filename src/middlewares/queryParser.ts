import { Model } from "objection";
import { EPagination, messageResponse } from "../enums";
import { Pagination } from "../interfaces";
import { apiResponse } from "../utils";

export const queryParser = async (req, res, next) => {
    const { filter = [], sort = [], page, pageSize } = req.query;

    const pagination: Pagination = {
        page: page ? parseInt(page) : EPagination.DEFAULT_PAGE,
        pageSize: pageSize ? parseInt(pageSize) : EPagination.DEFAULT_LIMIT,
    };

    try {
        // Ensure filter is an array and parse items as JSON if necessary
        const parsedFilter = Array.isArray(filter)
            ? filter.map((item) => (typeof item === "string" ? JSON.parse(item) : item))
            : filter;

        // Ensure sort is an array and parse items as JSON if necessary
        const parsedSort = Array.isArray(sort)
            ? sort.map((item) => (typeof item === "string" ? JSON.parse(item) : item))
            : sort;

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
                            return res.status(400).json(
                                apiResponse(messageResponse.INVALID_COLUMN, false, {
                                    column: columnName,
                                    table: tableName,
                                })
                            );
                        }
                    }
                }
            }
        }
        req.query = { filter: parsedFilter, sort: parsedSort, pagination };
        next();
    } catch (err) {
        return res.status(400).json(apiResponse(messageResponse.PARSE_ERROR, false));
    }
};
