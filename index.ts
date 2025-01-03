"use strict";
// import { Logs } from "@models";
import { contractCronJob } from "@utils";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { rateLimit } from "express-rate-limit";
import useragent from "express-useragent";
import path from "path";
import { serve, setup } from "swagger-ui-express";
import provinces from "./provinces.json";
import { swaggerSpec } from "./src/API/swagger";
import "./src/config/database.config";
import { authentication, queryParser, requestLogger } from "./src/middlewares";
import {
    AuthRoute,
    BillRoute,
    ContractRoute,
    EquipmentRoute,
    FloorRoute,
    HouseRoute,
    IssueRoute,
    NotificationRouter,
    PaymentMethodRoute,
    RenterRoute,
    RoleRoute,
    RoomRoute,
    ServiceRoute,
    StaticRoute,
    statisticalRoute,
    UserRoute,
} from "./src/routes";
import uploadRoute from "./src/routes/upload.route";

const PORT = process.env.PORT || 3000;

const app = express();
app.use("/api-docs", serve, setup(swaggerSpec));

// rate limit config
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000000000,
    message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(requestLogger);
app.use(limiter);
app.use(
    cors({
        credentials: true,
    })
);

app.use(bodyParser.json({ limit: "100mb" }));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use(useragent.express(), (req: any, _res, next) => {
    const userAgent = req.useragent;
    // console.log("User Agent: ", userAgent);
    const isApp =
        userAgent.isMobile ||
        userAgent.isMobileNative ||
        // userAgent.isTablet ||
        // userAgent.isiPad ||
        // userAgent.isiPod ||
        // userAgent.isiPhone ||
        // userAgent.isiPhoneNative ||
        userAgent.isAndroid ||
        userAgent.isAndroidNative ||
        // userAgent.isBlackberry ||
        userAgent.browser === "Dart" ||
        userAgent.browser === "Flutter" ||
        userAgent.source.includes("dart") ||
        userAgent.source.includes("flutter");

    req.isApp = isApp;

    console.log("Request is from app: ", isApp);

    next();
});

// cron job
contractCronJob.start();

// config view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// config static folder
app.use(express.static(path.join(__dirname, "src/public")));

// config query parser
app.use(queryParser);

app.use(StaticRoute);

// app.use(async (req, res, next) => {
//     const start = process.hrtime(); // Start timer
//     const password = req.body.password;
//     if (req.body.password) {
//         req.body.password = "********";
//     }

//     // Overriding res.send to capture response body
//     const originalSend = res.send;
//     res.send = async function (body) {
//         const diff = process.hrtime(start); // End timer
//         const responseTime: number = parseFloat((diff[0] * 1e3 + diff[1] / 1e6).toFixed(2)); // Convert to milliseconds

// await Logs.query().insert({
//     request_method: req.method,
//     endpoint: req.originalUrl,
//     request_payload: req.body,
//     response_payload: typeof body === "string" ? JSON.parse(body) : body,
//     client_ip: req.ip,
//     status_code: res.statusCode,
//     response_time_ms: responseTime,
//     user_agent: req.useragent.source,
//     referrer: req.headers.referer,
// });

//         return originalSend.call(this, body); // Send the response
//     };

//     if (req.body.password) req.body.password = password;
//     next();
// });

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
app.use("/notifications", NotificationRouter);
app.use("/uploads", uploadRoute);
app.use("/contracts", ContractRoute);
app.use("/statistical", statisticalRoute);
app.get("/provinces", async (_req, res) => {
    return res.json(provinces);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
