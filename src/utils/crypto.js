const CryptoJS = require("crypto-js");

const aesEncrypt = (data) => {
    const key = CryptoJS.enc.Base64.parse("NGYxYWFhZTY2NDA2ZTM1OA==");
    const iv = CryptoJS.enc.Base64.parse("ZGYxZTE4MDk0OTc5Mzk3Mg==");

    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
};

const aesDecrypt = (encrypted) => {
    const key = CryptoJS.enc.Base64.parse("NGYxYWFhZTY2NDA2ZTM1OA==");
    const iv = CryptoJS.enc.Base64.parse("ZGYxZTE4MDk0OTc5Mzk3Mg==");
    const decrypted = CryptoJS.AES.decrypt(
        {
            ciphertext: CryptoJS.enc.Base64.parse(encrypted),
        },
        key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
};

// Example usage
// const encryptedString = "AA+WdcgTaGRNC59C9sJEvg==";
// const encryptedString = aesEncrypt("Hello World");
// console.log(encryptedString);

// const decryptedString = aesDecrypt(encryptedString);
// console.log(decryptedString);

module.exports = { aesEncrypt, aesDecrypt };
