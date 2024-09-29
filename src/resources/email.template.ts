export const verifyCodeTemplate = (code: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Code</title>
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
                            <h2 style="color: #333333; font-size: 20px;">Verify Your Code</h2>
                            <p style="color: #666666;">Please use the following code to verify your account:</p>
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
                            <p style="color: #666666;">Enter this code on the verification page to complete the process.</p>
                            <a href="#" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; border-radius: 30px; text-decoration: none; font-size: 16px;">Verify Now</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f1f1f1; padding: 20px; text-align: center;">
                            <p style="color: #666666;">Need help? <a href="#" style="color: #007bff; text-decoration: none;">Contact Support</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

export const loginCodeTemplate = (name: string, code: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Verification Code</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; width: 100%; height: 100%; text-align: center;">
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px auto;">
        <tr>
            <td style="background-color: #4e54c8; color: #ffffff; text-align: center; padding: 20px; border-radius: 10px 10px 0 0;">
                <h1 style="font-size: 24px; margin: 0;">Hello, ${name}</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px; text-align: center;">
                <h2 style="font-size: 22px; margin-bottom: 20px;">Login Verification Code</h2>
                <p style="font-size: 16px; margin-bottom: 20px;">Please use the following code to login to your account:</p>
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
                <p style="font-size: 16px; margin-bottom: 20px;">Enter this code on the login page to access your account.</p>
                <a href="#" style="display: inline-block; background-color: #4e54c8; color: #ffffff; padding: 12px 30px; font-size: 16px; border-radius: 50px; text-decoration: none;">Login Now</a>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f1f1f1; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
                <p style="font-size: 14px; margin: 0;">Need help? <a href="#" style="color: #4e54c8; text-decoration: none;">Contact Support</a></p>
            </td>
        </tr>
    </table>
</body>
</html>`;


export const resetPasswordTemplate = (code: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password Code</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; width: 100%; height: 100%; text-align: center;">
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px auto;">
        <tr>
            <td style="background-color: #4e54c8; color: #ffffff; text-align: center; padding: 20px; border-radius: 10px 10px 0 0;">
                <h1 style="font-size: 24px; margin: 0;">Reset Your Password</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px; text-align: center;">
                <h2 style="font-size: 22px; margin-bottom: 20px;">Password Reset Code</h2>
                <p style="font-size: 16px; margin-bottom: 20px;">Please use the following code to reset your password:</p>
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
                <p style="font-size: 16px; margin-bottom: 20px;">Enter this code on the password reset page to complete the process.</p>
                <a href="#" style="display: inline-block; background-color: #4e54c8; color: #ffffff; padding: 12px 30px; font-size: 16px; border-radius: 50px; text-decoration: none;">Reset Password Now</a>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f1f1f1; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
                <p style="font-size: 14px; margin: 0;">Need help? <a href="#" style="color: #4e54c8; text-decoration: none;">Contact Support</a></p>
            </td>
        </tr>
    </table>
</body>
</html>`;
