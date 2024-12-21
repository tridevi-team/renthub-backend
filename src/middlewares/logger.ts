import type { NextFunction, Request, Response } from "express";
import { currentTime } from "../config/time.config";

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${currentTime}] ${req.method} ${decodeURIComponent(req.originalUrl)}`);
    next();
};

export default requestLogger;
