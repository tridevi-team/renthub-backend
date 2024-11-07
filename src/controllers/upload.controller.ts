import { messageResponse } from "../enums";
import { ApiException, apiResponse, Exception } from "../utils";

class UploadController {
    static async upload(req, res) {
        try {
            if (req.files.length === 0) {
                throw new ApiException(messageResponse.FILE_UPLOAD_FAILED, 400);
            }

            const fileUrls = req.files.map((file) => ({
                file: file.originalname,
                url: `${req.protocol}://${req.get("host")}/uploads/${file.originalname}`,
            }));

            return res.json(
                apiResponse(messageResponse.FILE_UPLOAD_SUCCESS, true, {
                    files: fileUrls,
                })
            );
        } catch (error) {
            Exception.handle(error, req, res);
        }
    }
}

export default UploadController;
