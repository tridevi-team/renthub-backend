// Combined Operators Enum
export enum Operator {
    // Numeric Operators
    Equals = "eq", // Equal to
    NotEquals = "ne", // Not equal to
    GreaterThan = "gt", // Greater than
    GreaterThanOrEqual = "gte", // Greater than or equal to
    LessThan = "lt", // Less than
    LessThanOrEqual = "lte", // Less than or equal to
    In = "in", // In array
    NotIn = "nin", // Not in array

    // String Operators
    Contains = "cont", // Contains
    DoesNotContain = "ncont", // Does not contain
    StartsWith = "sw", // Starts with
    EndsWith = "ew", // Ends with
    Matches = "match", // Matches regex
    DoesNotMatch = "nmatch", // Does not match regex
}
