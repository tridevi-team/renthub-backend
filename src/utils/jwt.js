const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "";

const jwtToken = {
    sign: (payload, time = "10h") =>
        jwt.sign(payload, JWT_SECRET, {
            expiresIn: time,
        }),
    verify: (token) => jwt.verify(token, JWT_SECRET),
    decode: (token) => jwt.decode(token),
};

module.exports = jwtToken;
