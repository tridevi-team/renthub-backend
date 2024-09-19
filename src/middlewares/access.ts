import { NextFunction, Request, Response } from "express";
import { Exception } from "../utils";

const access = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Check access");

        next();
    } catch (err) {
        Exception.handle(err, req, res);
    }
};

export default access;
