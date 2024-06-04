"use strict";
import Exception from "./Exception";

class ApiException extends Exception {
    constructor(code: Number = -1, message: any = "", data: any = null) {
        super(code, message, data, 400);
    }
}

export default ApiException;
