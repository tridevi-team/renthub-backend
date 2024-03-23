"use strict";
const bcrypt = require("bcrypt");

const saltRounds = 10;

const bcryptConfig = {
    hash: async (password) => {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    },
    compare: async (password, hash) => await bcrypt.compare(password, hash),
    compareSync: async (password, hash) => bcrypt.compareSync(password, hash),
};

module.exports = bcryptConfig;
