import { mkdirSync, renameSync } from "fs";
import multer from "multer";
import sharp from "sharp";

const FILE_SIZE_LIMIT = 25 * 1024 * 1024; // 25MB

const rootDir = process.cwd();
const UPLOADS_DIR = rootDir.includes("dist") ? `${rootDir}/../uploads` : `${rootDir}/uploads`;
mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
        console.log(file);

        const currentTimestamp = new Date().getTime();
        file.originalname = `${currentTimestamp}-${file.originalname.replace(/ /g, "_")}`;
        cb(null, file.originalname);
    },
});

const uploadMiddleware = multer({
    storage,
    limits: {
        fieldSize: FILE_SIZE_LIMIT,
    },
}).array("files");

const compressImage = async (filePath: string) => {
    const tempPath = `${filePath}-temp`; // Temporary path for the compressed image
    await sharp(filePath)
        .resize(1024, 1024, { fit: "inside" }) // Resize for optimization
        .jpeg({ quality: 80 }) // Compress with JPEG quality
        .toFile(tempPath); // Save to the temporary file
    renameSync(tempPath, filePath); // Replace the original file with the compressed file
};

const compressMiddleware = async (req, _res, next) => {
    try {
        if (req.files) {
            for (const file of req.files) {
                const ext = file.mimetype.split("/")[1];
                if (["jpeg", "jpg", "png", "webp"].includes(ext)) {
                    await compressImage(file.path);
                }
            }
        }
        next();
    } catch (error) {
        console.error("Image compression failed:", error);
        next(error);
    }
};

export { compressMiddleware, uploadMiddleware };
