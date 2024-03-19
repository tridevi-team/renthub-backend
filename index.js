"use strict";
const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// import routes
const { UserRoute, HouseRoute, ServiceRoute } = require("./src/routes");

// import database config
require("./src/config/database");

app.use(cors());
app.use(bodyParser.json());

app.use("/users", UserRoute);
app.use("/houses", HouseRoute);
app.use("/services", ServiceRoute);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
