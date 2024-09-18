type CamelToSnake<T> = {
    [K in keyof T as K extends string ? CamelToSnakeKey<K> : K]: T[K] extends object ? CamelToSnake<T[K]> : T[K];
};

type CamelToSnakeKey<K extends string> = K extends `${infer P}${infer R}` ? `${Lowercase<P>}${R extends Capitalize<R> ? `_${Lowercase<R>}` : R}` : K;

function camelToSnake(obj: any): any {
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
    }, {} as any);
}

function camelToSnakeKey(key: string): string {
    return key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`).toLowerCase();
}

export default camelToSnake;
