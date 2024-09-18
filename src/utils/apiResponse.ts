"use strict";

import messageResponse from "../enums/message.enum";

type ApiResponse = {
    success: boolean;
    code: string;
    message: string;
    data: object | any[];
};

const apiResponse = (message: string, success: boolean, data: object | any[] = {}): ApiResponse => {
    const code = Object.keys(messageResponse).find((key) => messageResponse[key as keyof typeof messageResponse] === message);

    return {
        success,
        code,
        message,
        data,
    };
};

export default apiResponse;
