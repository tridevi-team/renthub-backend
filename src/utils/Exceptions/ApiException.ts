"use strict";
import Exception from "./Exception";

class ApiException extends Exception {
    constructor(message: string, httpCode: number, data: any = null) {
        super(message, data, httpCode);
    }
}

export default ApiException;
