const Crypto = require("crypto-js");
const bcryptConfig = require("./bcrypt");
require("dotenv").config();

const cryptoConfig = {
    hash: (text) => Crypto.SHA256(text).toString(),
    encrypt: (text) => Crypto.AES.encrypt(text, process.env.CRYPTO_SECRET).toString(),
    decrypt: (text) => Crypto.AES.decrypt(text, process.env.CRYPTO_SECRET).toString(Crypto.enc.Utf8),
    compare: (text, hash) => Crypto.SHA256(text.toString()) === hash,
    test: async () => {
        const text = "12345678a";
        const key = process.env.CRYPTO_SECRET,
            encrypted = cryptoConfig.encrypt(text, key),
            decrypted = cryptoConfig.decrypt(encrypted, key);

        console.log("Text: ", text);
        console.log("Encrypted: ", encrypted);
        console.log("Decrypted: ", decrypted);
        console.log(await bcryptConfig.hash(text));
    },
};

module.exports = cryptoConfig;
