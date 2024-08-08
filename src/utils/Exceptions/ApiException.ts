"use strict";
import Exception from "./Exception";

class ApiException extends Exception {
    constructor(code: number = -1, message: string = "", data: any = null) {
        super(code, message, data, 400);
    }
}

export default ApiException;
