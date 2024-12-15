import { UploadController } from "@controllers";
import { authentication, compressMiddleware, uploadMiddleware } from "@middlewares";
import express from "express";

const uploadRoute = express.Router();

uploadRoute.post("", authentication, uploadMiddleware, compressMiddleware, UploadController.upload);

export default uploadRoute;
