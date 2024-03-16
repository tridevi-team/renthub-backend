const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "";

const jwtConfig = {
    sign: (payload, time = "1h") =>
        jwt.sign(payload, JWT_SECRET, {
            expiresIn: time,
        }),
    verify: (token) => jwt.verify(token, JWT_SECRET),
    decode: (token) => jwt.decode(token),
};

module.exports = jwtConfig;
