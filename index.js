"use strict";
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// import routes
const { UserRoute, HouseRoute, ServiceRoute, RoomRoute } = require("./src/routes");
const uploadImages = require("./src/services/uploadImages");

// import database config
require("./src/config/database");

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static("src/public"));

app.use("/users", UserRoute);
app.use("/houses", HouseRoute);
app.use("/services", ServiceRoute);
app.use("/rooms", RoomRoute);

app.post("/upload", uploadImages);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
