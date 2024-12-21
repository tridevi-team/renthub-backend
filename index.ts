"use strict";
// import { Logs } from "@models";
import { ApiException, contractCronJob } from "@utils";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { rateLimit } from "express-rate-limit";
import useragent from "express-useragent";

import { messageResponse } from "@enums";
import { ContractService, RoomService } from "@services";
import path from "path";
import puppeteer from "puppeteer";
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

app.get("/generate-pdf", async (req, res) => {
    const { contractId } = req.query;
    try {
        if (!contractId) throw new ApiException(messageResponse.UNKNOWN_ERROR, 500, false);
        const pdfName = "puppeteer-example.pdf";
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const contractDetails = await ContractService.findOneRoomContract(contractId as string);
        const roomDetails = await RoomService.getRoomById(contractDetails.roomId);

        let html = contractDetails.content;

        const replaceKeyData = await ContractService.findKeyData(contractId as string);

        // Replace placeholders with dynamic content
        for (const key in replaceKeyData) {
            if (key === "EQUIPMENT_LIST") {
                const vi = {
                    NORMAL: "Bình thường",
                    BROKEN: "Hỏng",
                    REPAIRING: "Đang sửa chữa",
                    DISPOSED: "Đã thanh lý",
                };
                let equipmentList = `<table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
                    <tr><th>Mã thiết bị</th><th style="border: 1px solid black;">Tên thiết bị</th><th style="border: 1px solid black;">Trạng thái</th></tr>`;
                replaceKeyData[key].forEach((item: any) => {
                    equipmentList += `<tr>
                        <td style="border: 1px solid black;">${item.code}</td>
                        <td style="border: 1px solid black;">${item.name}</td>
                        <td style="border: 1px solid black;">${vi[item.status]}</td></tr>`;
                });
                equipmentList += `</table>`;
                html = html.replace(new RegExp(`{{${key}}}`, "g"), equipmentList);
            } else if (key === "USE_SERVICES") {
                const vi = {
                    PEOPLE: "Người",
                    ROOM: "Phòng",
                    WATER_CONSUMPTION: "m3",
                    ELECTRICITY_CONSUMPTION: "kWh",
                };
                let servicesList = `<table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
                    <tr><th>Tên dịch vụ</th><th style="border: 1px solid black;">Đơn giá</th><th style="border: 1px solid black;">Loại</th>
                    <th>Chỉ số đầu</th></tr>`;
                replaceKeyData[key].forEach((item: any) => {
                    servicesList += `<tr>
                        <td style="border: 1px solid black;">${item.name}</td>
                        <td style="border: 1px solid black;">${item.unitPrice}</td>
                        <td style="border: 1px solid black;">${vi[item.type]}</td>
                        <td style="border: 1px solid black;">${item.startIndex}</td></tr>`;
                });
                servicesList += `</table>`;
                html = html.replace(new RegExp(`{{${key}}}`, "g"), servicesList);
            } else {
                html = html.replace(new RegExp(`{{${key}}}`, "g"), replaceKeyData[key]);
            }
        }

        // Set the HTML of this page
        await page.setContent(html, { waitUntil: "load" });

        // Pass roomDetails to the browser context for setting the document title
        await page.evaluate((roomDetails) => {
            document.title = `Hợp đồng thuê phòng ${roomDetails.name} - ${roomDetails.house.name}`;
        }, roomDetails);

        // Save the page into a PDF and call it 'puppeteer-example.pdf'
        await page.pdf({ path: `./${pdfName}` });

        // When everything's done, close the browser instance
        await browser.close();

        // Send the PDF as a response
        return res.sendFile(pdfName, { root: __dirname });
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send("Error generating PDF");
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
