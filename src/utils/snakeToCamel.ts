function snakeToCamel(obj: object): object {
    if (obj === null || obj === undefined || typeof obj !== "object") {
        return obj;
    }

    // Handle Date objects explicitly
    if (obj instanceof Date) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(snakeToCamel);
    }

    return Object.keys(obj).reduce((acc, key) => {
        const camelKey = snakeToCamelKey(key);
        acc[camelKey] = snakeToCamel(obj[key]);
        return acc;
    }, {} as object);
}

function snakeToCamelKey(key: string): string {
    return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export default snakeToCamel;
