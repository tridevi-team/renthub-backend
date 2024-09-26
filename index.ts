"use strict";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { mkdirSync } from "fs";
import multer from "multer";
import path from "path";
import { serve, setup } from "swagger-ui-express";
import { swaggerSpec } from "./src/API/swagger";
import "./src/config/database.config";
import messageResponse from "./src/enums/message.enum";
import { authentication, requestLogger } from "./src/middlewares";
import { AuthRoute, EquipmentRoute, FloorRoute, HouseRoute, PaymentMethodRoute, RenterRoute, RoleRoute, RoomRoute, ServiceRoute, UserRoute } from "./src/routes";
import { aesEncrypt, apiResponse } from "./src/utils";

const PORT = process.env.PORT || 3000;

const app = express();
app.use("/api-docs", serve, setup(swaggerSpec));

// rate limit config
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(requestLogger);
app.use(limiter);
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/public", express.static("src/public"));

app.use("/encrypt", (req, res) => {
    return res.json({
        raw: req.query.raw,
        encrypted: aesEncrypt(req.query.raw),
    });
});

const UPLOADS_DIR = path.join("./src/public/uploads");
mkdirSync(UPLOADS_DIR, { recursive: true });

app.post(
    "/upload",
    multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, UPLOADS_DIR);
            },
            filename: (req, file, cb) => {
                const currentTimestamp = new Date().getTime();
                file.originalname = `${currentTimestamp}-${file.originalname}`;
                cb(null, file.originalname);
            },
        }),
    }).single("file"),
    (req, res) => {
        return res.json(
            apiResponse(messageResponse.FILE_UPLOAD_SUCCESS, true, {
                file: req.file?.originalname,
                url: `${req.protocol}://${req.get("host")}/public/uploads/${req.file?.originalname}`,
            })
        );
    }
);

app.use("/auth", AuthRoute);
app.use("/users", authentication, UserRoute);
app.use("/houses", HouseRoute);
app.use("/floors", FloorRoute);
app.use("/roles", authentication, RoleRoute);
app.use("/renters", authentication, RenterRoute);
app.use("/services", ServiceRoute);
app.use("/rooms", RoomRoute);
app.use("/equipment", EquipmentRoute);
app.use("/paymentMethods", PaymentMethodRoute);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
