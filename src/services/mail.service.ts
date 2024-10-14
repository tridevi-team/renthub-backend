import { messageResponse } from "../enums";
import { loginCodeTemplate, resetPasswordTemplate, verifyCodeTemplate } from "../resources";
import { ApiException, sendMail } from "../utils";

class MailService {
    static async sendVerificationMail(email: string, verifyCode: string) {
        const mail = await sendMail({
            to: email,
            subject: "Verify your account",
            text: `Your verification code is: ${verifyCode}`,
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
            subject: "Reset your password",
            text: `Your verification code is: ${code}`,
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
            subject: "Login verification",
            text: `Your verification code is: ${code}`,
            html: loginCodeTemplate(name, code),
        });
        if (!mail) {
            throw new ApiException(messageResponse.FAILED_EMAIL_VERIFICATION, 500);
        }
        return mail;
    }
}

export default MailService;
