export const verifyCodeTemplate = (code: string) => `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác Minh Mã Của Bạn</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    <tr>
                        <td style="background: linear-gradient(45deg, #4e54c8, #8f94fb); padding: 20px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">SecureVerify</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px; text-align: center;">
                            <h2 style="color: #333333; font-size: 20px;">Xác Minh Mã Của Bạn</h2>
                            <p style="color: #666666;">Vui lòng sử dụng mã sau để xác minh tài khoản của bạn:</p>
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 20px auto; text-align: center; border-spacing: 10px;">
                            <tr>
                                ${code
                                    .split("")
                                    .map(
                                        (digit) => `
                                        <td style="padding: 10px; background-color: #e9ecef; font-size: 24px; font-weight: bold; border-radius: 8px; text-align: center; width: 50px;">
                                            ${digit}
                                        </td>`
                                    )
                                    .join("")}
                            </tr>
                        </table>
                            <p style="color: #666666;">Nhập mã này trên trang xác minh để hoàn tất quá trình.</p>
                            <a href="#" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; border-radius: 30px; text-decoration: none; font-size: 16px;">Xác Minh Ngay</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f1f1f1; padding: 20px; text-align: center;">
                            <p style="color: #666666;">Cần hỗ trợ? <a href="#" style="color: #007bff; text-decoration: none;">Liên hệ hỗ trợ</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

export const loginCodeTemplate = (name: string, code: string) => `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã Đăng Nhập</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; width: 100%; height: 100%; text-align: center;">
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px auto;">
        <tr>
            <td style="background-color: #4e54c8; color: #ffffff; text-align: center; padding: 20px; border-radius: 10px 10px 0 0;">
                <h1 style="font-size: 24px; margin: 0;">Xin chào, ${name}</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px; text-align: center;">
                <h2 style="font-size: 22px; margin-bottom: 20px;">Mã Xác Minh Đăng Nhập</h2>
                <p style="font-size: 16px; margin-bottom: 20px;">Vui lòng sử dụng mã sau để đăng nhập vào tài khoản của bạn:</p>
                <table cellpadding="0" cellspacing="10" border="0" align="center" style="margin-bottom: 30px;">
                    <tr>
                        ${code
                            .split("")
                            .map(
                                (digit) => `
                                <td style="width: 50px; height: 60px; background-color: #e9ecef; font-size: 24px; font-weight: bold; border-radius: 8px; text-align: center; vertical-align: middle;">
                                    ${digit}
                                </td>`
                            )
                            .join("")}
                    </tr>
                </table>
                <p style="font-size: 16px; margin-bottom: 20px;">Nhập mã này trên trang đăng nhập để truy cập tài khoản.</p>
                <a href="#" style="display: inline-block; background-color: #4e54c8; color: #ffffff; padding: 12px 30px; font-size: 16px; border-radius: 50px; text-decoration: none;">Đăng Nhập Ngay</a>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f1f1f1; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
                <p style="font-size: 14px; margin: 0;">Cần hỗ trợ? <a href="#" style="color: #4e54c8; text-decoration: none;">Liên hệ hỗ trợ</a></p>
            </td>
        </tr>
    </table>
</body>
</html>`;

export const resetPasswordTemplate = (code: string) => `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã Đặt Lại Mật Khẩu</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; width: 100%; height: 100%; text-align: center;">
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px auto;">
        <tr>
            <td style="background-color: #4e54c8; color: #ffffff; text-align: center; padding: 20px; border-radius: 10px 10px 0 0;">
                <h1 style="font-size: 24px; margin: 0;">Đặt Lại Mật Khẩu</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px; text-align: center;">
                <h2 style="font-size: 22px; margin-bottom: 20px;">Mã Đặt Lại Mật Khẩu</h2>
                <p style="font-size: 16px; margin-bottom: 20px;">Vui lòng sử dụng mã sau để đặt lại mật khẩu của bạn:</p>
                <table cellpadding="0" cellspacing="10" border="0" align="center" style="margin-bottom: 30px;">
                    <tr>
                        ${code
                            .split("")
                            .map(
                                (digit) => `
                                <td style="width: 50px; height: 60px; background-color: #e9ecef; font-size: 24px; font-weight: bold; border-radius: 8px; text-align: center; vertical-align: middle;">
                                    ${digit}
                                </td>`
                            )
                            .join("")}
                    </tr>
                </table>
                <p style="font-size: 16px; margin-bottom: 20px;">Nhập mã này trên trang đặt lại mật khẩu để hoàn tất quá trình.</p>
                <a href="#" style="display: inline-block; background-color: #4e54c8; color: #ffffff; padding: 12px 30px; font-size: 16px; border-radius: 50px; text-decoration: none;">Đặt Lại Mật Khẩu Ngay</a>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f1f1f1; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
                <p style="font-size: 14px; margin: 0;">Cần hỗ trợ? <a href="#" style="color: #4e54c8; text-decoration: none;">Liên hệ hỗ trợ</a></p>
            </td>
        </tr>
    </table>
</body>
</html>`;
