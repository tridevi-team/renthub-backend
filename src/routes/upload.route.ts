import express from "express";
import UploadController from "../controllers/upload.controller";
import { authentication, uploadMiddleware } from "../middlewares";

const uploadRoute = express.Router();

uploadRoute.post("", authentication, uploadMiddleware, UploadController.upload);

export default uploadRoute;
