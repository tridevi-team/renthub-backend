
function camelToSnake(obj: object): object {
    if (obj === null || obj === undefined || typeof obj !== "object") {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(camelToSnake);
    }

    return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = camelToSnakeKey(key);
        acc[snakeKey] = camelToSnake(obj[key]);
        return acc;
    }, {} as object);
}

function camelToSnakeKey(key: string): string {
    return key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`).toLowerCase();
}

export default camelToSnake;
