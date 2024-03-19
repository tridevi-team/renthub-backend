"use strict";
const userValidator = require("./Users");
const houseValidator = require("./Houses");

module.exports = {
    ...userValidator,
    ...houseValidator,
};
