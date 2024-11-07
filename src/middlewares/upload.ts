import { mkdirSync } from "fs";
import multer from "multer";

const FILE_SIZE_LIMIT = 25 * 1024 * 1024; // 25MB

const rootDir = process.cwd();
const UPLOADS_DIR = rootDir.includes("dist") ? `${rootDir}/../uploads` : `${rootDir}/uploads`;
mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
        const currentTimestamp = new Date().getTime();
        file.originalname = `${currentTimestamp}-${file.originalname}`;
        cb(null, file.originalname);
    },
});

const uploadMiddleware = multer({
    storage,
    limits: {
        fieldSize: FILE_SIZE_LIMIT,
    },
}).array("files");

export default uploadMiddleware;
