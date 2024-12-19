import { messageResponse } from "../enums";
import { loginCodeTemplate, rentalContractTemplate, resetPasswordTemplate, verifyCodeTemplate } from "../resources";
import { ApiException, sendMail } from "../utils";

class MailService {
    static async sendVerificationMail(email: string, verifyCode: string) {
        const mail = await sendMail({
            to: email,
            subject: "Xác thực tài khoản",
            text: `Mã xác nhân của bạn là: ${verifyCode}`,
            html: verifyCodeTemplate(String(verifyCode)),
        });
        if (!mail) {
            throw new ApiException(messageResponse.FAILED_EMAIL_VERIFICATION, 500);
        }
        return mail;
    }

    static async sendResetPasswordMail(email: string, code: string) {
        const mail = await sendMail({
            to: email,
            subject: "Khôi phục mật khẩu",
            text: `Mã xác nhận của bạn là: ${code}`,
            html: resetPasswordTemplate(code),
        });
        if (!mail) {
            throw new ApiException(messageResponse.FAILED_EMAIL_VERIFICATION, 500);
        }
        return mail;
    }

    static async sendLoginMail(email: string, name: string, code: string) {
        const mail = await sendMail({
            to: email,
            subject: "Mã xác minh đăng nhập",
            text: `Mã xác nhận của bạn là: ${code}`,
            html: loginCodeTemplate(name, code),
        });
        if (!mail) {
            throw new ApiException(messageResponse.FAILED_EMAIL_VERIFICATION, 500);
        }
        return mail;
    }

    static async sendContractCreatedMail(email: string, name: string, contractId: string) {
        const mail = await sendMail({
            to: email,
            subject: "Hợp đồng thuê phòng " + name,
            text: `Hợp đồng thuê phòng ${name} đã được tạo thành công. Mã hợp đồng của bạn là: ${contractId}`,
            html: rentalContractTemplate(name),
        });

        if (!mail) {
            throw new ApiException(messageResponse.FAILED_EMAIL_VERIFICATION, 500);
        }

        return mail;
    }
}

export default MailService;
