"use strict";
import express from "express";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import "dotenv/config";

import { UserRoute, HouseRoute, ServiceRoute, RoomRoute } from "./src/routes";
import uploadImages from "./src/services/uploadImages";
import { aesEncrypt } from "./src/utils";

import { ignoreAuth, houseAccess } from "./src/middlewares";

import "./src/config/database";

const PORT = process.env.PORT || 3000;

const app = express();

// rate limit config
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
});


app.use(limiter);
app.use(cors());
app.use(ignoreAuth);
app.use(houseAccess);
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static("src/public"));

app.use("/users", UserRoute);
app.use("/houses", HouseRoute);
app.use("/services", ServiceRoute);
app.use("/rooms", RoomRoute);

app.post("/upload", uploadImages);

console.log("===== DATA TEST =====");
console.log("Plain text 1: TMQuang_test01");
console.log("Encrypted text 1:", aesEncrypt("TMQuang_test01"));
console.log("Plain text 2: TMQuang_test02");
console.log("Encrypted text 2:", aesEncrypt("TMQuang_test02"));
console.log("=====================");

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
