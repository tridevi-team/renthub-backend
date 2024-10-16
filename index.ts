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
import { authentication, queryParser, requestLogger } from "./src/middlewares";
import {
    AuthRoute,
    BillRoute,
    EquipmentRoute,
    FloorRoute,
    HouseRoute,
    IssueRoute,
    PaymentMethodRoute,
    RenterRoute,
    RoleRoute,
    RoomRoute,
    ServiceRoute,
    StaticRoute,
    UserRoute,
} from "./src/routes";
import { apiResponse } from "./src/utils";

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
app.use(express.urlencoded({ extended: true }));

// config view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// config static folder
app.use(express.static(path.join(__dirname, "src/public")));

// config query parser
app.use(queryParser);

const UPLOADS_DIR = path.join("./src/public/uploads");
mkdirSync(UPLOADS_DIR, { recursive: true });

app.post(
    "/upload",
    multer({
        storage: multer.diskStorage({
            destination: (_req, _file, cb) => {
                cb(null, UPLOADS_DIR);
            },
            filename: (_req, file, cb) => {
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

app.use(StaticRoute);
app.use("/auth", AuthRoute);
app.use("/users", authentication, UserRoute);
app.use("/houses", HouseRoute);
app.use("/floors", FloorRoute);
app.use("/roles", RoleRoute);
app.use("/renters", RenterRoute);
app.use("/services", ServiceRoute);
app.use("/rooms", RoomRoute);
app.use("/equipment", EquipmentRoute);
app.use("/payment", PaymentMethodRoute);
app.use("/issues", IssueRoute);
app.use("/bills", BillRoute);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
