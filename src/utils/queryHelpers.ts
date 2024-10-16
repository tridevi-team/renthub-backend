import { QueryBuilder } from "objection";
import { Operator } from "../enums";

const jsonSearch = ["city", "district", "ward", "street", "address"];

export const filterHandler = (query, filter) => {
    if (Array.isArray(filter)) {
        for (const item of filter) {
            const [, value] = item.field.split(".");
            if (jsonSearch.includes(value)) {
                applyFilterJson(query, item.field, item.operator, item.value);
            } else {
                applyFilterCondition(query, item.field, item.operator, item.value);
            }
        }
    }
    return query;
};

// const applyFilterCount = (query: QueryBuilder<any>, key: string, op: Operator, value: string) => {

// };

const applyFilterJson = (query: QueryBuilder<any>, key: string, op: Operator, value: string) => {
    const addressFields = ["city", "district", "ward", "street"];
    const [, field] = key.split(".");
    if (addressFields.includes(field)) {
        key = key.replace(field, "address");
    }

    const jsonPath = `JSON_UNQUOTE(JSON_EXTRACT(${key}, '$.${field}'))`;

    const operations = {
        [Operator.Equals]: () => query.whereRaw(`${jsonPath} = ?`, value),
        [Operator.NotEquals]: () => query.whereRaw(`${jsonPath} != ?`, value),
        [Operator.Contains]: () => query.whereRaw(`${jsonPath} like ?`, `%${value}%`),
        [Operator.DoesNotContain]: () => query.whereRaw(`${jsonPath} not like ?`, `%${value}%`),
        [Operator.StartsWith]: () => query.whereRaw(`${jsonPath} like ?`, `${value}%`),
        [Operator.EndsWith]: () => query.whereRaw(`${jsonPath} like ?`, `%${value}`),
        [Operator.Matches]: () => query.whereRaw(`${jsonPath} regexp ?`, value),
        [Operator.DoesNotMatch]: () => query.whereRaw(`${jsonPath} not regexp ?`, value),
    };

    const applyOperation = operations[op];
    return applyOperation ? applyOperation() : query;
};

const applyFilterCondition = (query: QueryBuilder<any>, key: string, op: Operator, value: string) => {
    const operations = {
        [Operator.Equals]: () => query.where(key, "=", value),
        [Operator.NotEquals]: () => query.where(key, "!=", value),
        [Operator.GreaterThan]: () => query.where(key, ">", value),
        [Operator.GreaterThanOrEqual]: () => query.where(key, ">=", value),
        [Operator.LessThan]: () => query.where(key, "<", value),
        [Operator.LessThanOrEqual]: () => query.where(key, "<=", value),
        [Operator.In]: () => query.whereIn(key, value),
        [Operator.NotIn]: () => query.whereNotIn(key, value),
        [Operator.Contains]: () => query.where(key, "like", `%${value}%`),
        [Operator.DoesNotContain]: () => query.where(key, "not like", `%${value}%`),
        [Operator.StartsWith]: () => query.where(key, "like", `${value}%`),
        [Operator.EndsWith]: () => query.where(key, "like", `%${value}`),
        [Operator.Matches]: () => query.where(key, "regexp", value),
        [Operator.DoesNotMatch]: () => query.where(key, "not regexp", value),
    };

    const applyOperation = operations[op];
    return applyOperation ? applyOperation() : query;
};

export const sortingHandler = (query, sorting) => {
    if (Array.isArray(sorting)) {
        for (const item of sorting) {
            query.orderBy(item.field, item.direction);
        }
    }
    return query;
};
