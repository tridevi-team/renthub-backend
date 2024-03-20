"use strict";
const userValidator = require("./Users");
const houseValidator = require("./Houses");
const serviceValidator = require("./Services");
const roomsValidator = require("./Rooms");

module.exports = {
    ...userValidator,
    ...houseValidator,
    ...serviceValidator,
    ...roomsValidator,
};
