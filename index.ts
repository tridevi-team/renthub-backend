"use strict";
import express from "express";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import "dotenv/config";

import { UserRoute, HouseRoute, ServiceRoute, RoomRoute, EquipmentRoute, PaymentMethodRoute, renterRoute } from "./src/routes";
import { aesEncrypt } from "./src/utils";

import { ignoreAuth, requestLogger } from "./src/middlewares";

import "./src/config/database.config";

const PORT = process.env.PORT || 3000;

const app = express();

// rate limit config
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(requestLogger);
app.use(limiter);
app.use(cors());
app.use(ignoreAuth);
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static("src/public"));

app.use("/users", UserRoute);
app.use("/houses", HouseRoute);
app.use("/services", ServiceRoute);
app.use("/rooms", RoomRoute);
app.use("/equipment", EquipmentRoute);
app.use("/paymentMethods", PaymentMethodRoute);
app.use("/renters", renterRoute);

console.log("===== DATA TEST =====");
console.log("Plain text 1: TMQuang_test01");
console.log("Encrypted text 1:", aesEncrypt("TMQuang_test01"));
console.log("Plain text 2: TMQuang_test02");
console.log("Encrypted text 2:", aesEncrypt("TMQuang_test02"));
console.log("=====================");

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
