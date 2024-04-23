"use strict";
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// import routes
const { UserRoute, HouseRoute, ServiceRoute, RoomRoute } = require("./src/routes");
const uploadImages = require("./src/services/uploadImages");
const { aesEncrypt } = require("./src/utils");

// import database config
require("./src/config/database");

// rate limit config
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(limiter);
app.use(cors());
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
