"use strict";

import messageResponse from "../enums/message.enum";

type ApiResponse = {
    success: boolean;
    code: string;
    message: string;
    data: object | unknown[];
};

const apiResponse = (message: string, success: boolean, data: object | unknown[] = {}): ApiResponse => {
    const code = Object.keys(messageResponse).find(
        (key) => messageResponse[key as keyof typeof messageResponse] === message
    );

    return {
        success,
        code: code || "UNKNOWN_ERROR",
        message,
        data,
    };
};

export default apiResponse;
