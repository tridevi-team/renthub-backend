"use strict";
import { Client } from "ssh2";
import uuid from "uuid";
import { formatJson, ApiException, Exception } from "../utils";
import "dotenv/config";

const uploadImages = async (req, res) => {
    // Get the file that was set to our field named "image"
    const { image } = req.files;

    // If no image submitted, exit
    if (!image) return res.sendStatus(400);

    try {
        // get format file
        const format = image.name.split(".").pop();

        const rename = uuid.v4().concat(".").concat(format);
        // Move the uploaded image to our upload folder
        await image.mv(`src/services/upload/${rename}`);

        const client = new Client();

        client.on("ready", () => {
            console.log("Client connected");
            client.sftp((err, sftp) => {
                if (err) {
                    console.error("SFTP error:", err);
                    res.status(500).send(err); // Send error response
                    client.end();
                    return;
                }

                sftp.fastPut(`src/services/upload/${rename}`, `images.tmquang.com/uploads/${rename}`, (err) => {
                    if (err) {
                        console.error("Upload error:", err);
                        res.status(500).send(err); // Send error response
                        client.end();
                        throw new ApiException(1002, "Error occurred", err);
                    }
                    client.end();

                    return res.json(formatJson.success(1001, "Upload success", { url: `https://images.tmquang.com/uploads/${rename}` }));
                });
            });
        });

        client.on("error", (err) => {
            client.end();
            throw new ApiException(1002, "Error occurred", err);
        });

        client.connect({
            host: process.env.FTP_HOST,
            port: process.env.FTP_PORT || 22,
            username: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            algorithms: {
                serverHostKey: ["ssh-rsa", "ssh-dss"],
            },
        });
    } catch (err) {
        Exception.handle(err, req, res);
    }
};

export default uploadImages;
