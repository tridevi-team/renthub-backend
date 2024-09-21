enum messageResponse {
    UNKNOWN_ERROR = "Unknown error",
    FILE_UPLOAD_SUCCESS = "File uploaded successfully",
    FILE_UPLOAD_FAILED = "File upload failed",
    GET_USERS_LIST_SUCCESS = "Get users list successfully",
    NO_USERS_FOUND = "No users found",
    GET_USER_SUCCESS = "Get user successfully",
    GET_USER_FAIL = "Get user failed",
    GET_USER_NOT_FOUND = "User not found",
    INVALID_USER = "Invalid username or password",
    VERIFY_ACCOUNT_FIRST = "Please verify your account first",
    ACCOUNT_DISABLED = "Your account has been disabled. Please contact the administrator",
    LOGIN_SUCCESS = "Login successfully",
    USER_ALREADY_EXISTS = "User already exists",
    FAILED_EMAIL_VERIFICATION = "Failed to send email verification code. Please try again",
    CHECK_EMAIL_VERIFY_ACCOUNT = "Please check your email to verify your account",
    FAILED_CREATE_USER = "Failed to create user",
    VALIDATION_ERROR = "Validation error",
    INVALID_VERIFICATION_CODE = "Verification code is incorrect",
    ACCOUNT_VERIFIED_SUCCESSFULLY = "Account verified successfully",
    ACCOUNT_PREVIOUSLY_VERIFIED = "The account has been previously verified",
    CHECK_EMAIL_RESET_PASSWORD = "Please check your email to reset your password",
    PASSWORD_RESET_SUCCESS = "Password reset successfully",
    INCORRECT_OLD_PASSWORD = "Old password is incorrect",
    PASSWORD_UPDATE_SUCCESS = "Password updated successfully",
    PROFILE_UPDATE_SUCCESS = "Profile updated successfully",
    FIRST_LOGIN_STATUS_UPDATE_SUCCESS = "First login status updated successfully",
    ACCESS_TOKEN_REQUIRED = "Access token is required",
    TOKEN_EXPIRED = "Token expired",
    TOKEN_INVALID = "Token invalid",
    GET_HOUSE_LIST_SUCCESS = "House list retrieved successfully",
    NO_HOUSES_FOUND = "No houses found",
    HOUSE_ALREADY_EXISTS = "House already exists",
    CREATE_HOUSE_SUCCESS = "House created successfully",
    HOUSE_NOT_FOUND = "House was not found",
    UPDATE_HOUSE_SUCCESS = "Update house successful",
    UPDATE_HOUSE_FAIL = "Update house failed",
    DELETE_HOUSE_FAIL = "Delete house failed",
    DELETE_HOUSE_SUCCESS = "Delete house successful",
    UPDATE_HOUSE_STATUS_SUCCESS = "Update house status successful",
    UPDATE_HOUSE_STATUS_FAIL = "Update house status failed",
    GET_HOUSE_DETAILS_SUCCESS = "Get house details successful",
    ROLE_NAME_ALREADY_EXISTS = "Role name already exists",
    CREATE_ROLE_SUCCESS = "Create new role successfully",
    ROLE_NOT_FOUND = "Role not found",
    UPDATE_ROLE_SUCCESS = "Update role successful",
    UPDATE_ROLE_STATUS_SUCCESS = "Update role status successful",
    UPDATE_ROLE_ERROR = "Error while updating role",
    GET_ROLE_DETAILS_SUCCESS = "Get role details successful",
    HOUSE_NO_ROLE_CREATED = "House doesn't create any role",
    GET_ROLES_BY_HOUSE_SUCCESS = "Get roles list by house successful",
    DELETE_ROLE_ERROR = "Error while deleting role",
    DELETE_ROLE_SUCCESS = "Delete role successful",
    CANNOT_ASSIGN_ROLE_TO_SELF = "You cannot assign roles to yourself",
    CANNOT_ASSIGN_ROLE_TO_HOUSE_OWNER = "You cannot assign role to house owner",
    ASSIGN_ROLE_SUCCESS = "Assign role successful",
}

export default messageResponse;
