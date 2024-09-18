import { Request, Response, NextFunction } from "express";
import { currentTime } from "../config/time.config";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${currentTime}] ${req.method} ${req.originalUrl}`);
    next();
};

export default requestLogger;
