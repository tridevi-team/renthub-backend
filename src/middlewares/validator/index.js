"use strict";
const userValidator = require("./Users");
const houseValidator = require("./Houses");
const serviceValidator = require("./Services");

module.exports = {
    ...userValidator,
    ...houseValidator,
    ...serviceValidator,
};
