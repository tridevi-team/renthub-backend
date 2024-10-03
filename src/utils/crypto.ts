"use strict";
import * as CryptoJS from "crypto-js";
import "dotenv/config";

const aesEncrypt = (data) => {
    const key = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_KEY);
    const iv = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_IV);

    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
};

const aesDecrypt = (encrypted) => {
    const key = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_KEY);
    const iv = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_IV);

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

export { aesEncrypt, aesDecrypt };
