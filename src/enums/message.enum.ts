enum messageResponse {
    UNKNOWN_ERROR = "An unknown error occurred",
    UNAUTHORIZED = "You are not authorized to access this resource",
    FILE_UPLOAD_SUCCESS = "File uploaded successfully",
    FILE_UPLOAD_FAILED = "File upload failed",
    PERMISSION_DENIED = "Permission denied",
    GET_USERS_LIST_SUCCESS = "Users list retrieved successfully",
    NO_USERS_FOUND = "No users found",
    GET_USER_SUCCESS = "User retrieved successfully",
    GET_USER_FAIL = "Failed to retrieve user",
    GET_USER_NOT_FOUND = "User not found",
    INVALID_USER = "Invalid username or password",
    VERIFY_ACCOUNT_FIRST = "Please verify your account first",
    ACCOUNT_DISABLED = "Your account has been disabled. Please contact the administrator",
    LOGIN_SUCCESS = "Login successful",
    USER_ALREADY_EXISTS = "User already exists",
    FAILED_EMAIL_VERIFICATION = "Failed to send email verification code. Please try again",
    CHECK_EMAIL_VERIFY_ACCOUNT = "Please check your email to verify your account",
    FAILED_CREATE_USER = "Failed to create user",
    VALIDATION_ERROR = "Validation error",
    INVALID_VERIFICATION_CODE = "Verification code is incorrect",
    ACCOUNT_VERIFIED_SUCCESSFULLY = "Account verified successfully",
    ACCOUNT_PREVIOUSLY_VERIFIED = "Account has been previously verified",
    CHECK_EMAIL_RESET_PASSWORD = "Please check your email to reset your password",
    PASSWORD_RESET_SUCCESS = "Password reset successful",
    INCORRECT_OLD_PASSWORD = "Incorrect old password",
    PASSWORD_UPDATE_SUCCESS = "Password updated successfully",
    PROFILE_UPDATE_SUCCESS = "Profile updated successfully",
    FIRST_LOGIN_STATUS_UPDATE_SUCCESS = "First login status updated successfully",
    ACCESS_TOKEN_REQUIRED = "Access token is required",
    TOKEN_EXPIRED = "Token has expired",
    TOKEN_INVALID = "Token is invalid",
    GET_HOUSE_LIST_SUCCESS = "House list retrieved successfully",
    NO_HOUSES_FOUND = "No houses found",
    HOUSE_ALREADY_EXISTS = "House already exists",
    CREATE_HOUSE_SUCCESS = "House created successfully",
    HOUSE_NOT_FOUND = "House not found",
    UPDATE_HOUSE_SUCCESS = "House updated successfully",
    UPDATE_HOUSE_FAIL = "Failed to update house",
    DELETE_HOUSE_FAIL = "Failed to delete house",
    DELETE_HOUSE_SUCCESS = "House deleted successfully",
    UPDATE_HOUSE_STATUS_SUCCESS = "House status updated successfully",
    UPDATE_HOUSE_STATUS_FAIL = "Failed to update house status",
    GET_HOUSE_DETAILS_SUCCESS = "House details retrieved successfully",
    SEARCH_HOUSE_SUCCESS = "House search successful",
    ROLE_NAME_ALREADY_EXISTS = "Role name already exists",
    CREATE_ROLE_SUCCESS = "New role created successfully",
    ROLE_NOT_FOUND = "Role not found",
    UPDATE_ROLE_SUCCESS = "Role updated successfully",
    UPDATE_ROLE_STATUS_SUCCESS = "Role status updated successfully",
    UPDATE_ROLE_ERROR = "Error occurred while updating role",
    GET_ROLE_DETAILS_SUCCESS = "Role details retrieved successfully",
    HOUSE_NO_ROLE_CREATED = "House has not created any role",
    GET_ROLES_BY_HOUSE_SUCCESS = "Roles list by house retrieved successfully",
    DELETE_ROLE_ERROR = "Error occurred while deleting role",
    DELETE_ROLE_SUCCESS = "Role deleted successfully",
    CANNOT_ASSIGN_ROLE_TO_SELF = "You cannot assign roles to yourself",
    CANNOT_ASSIGN_ROLE_TO_HOUSE_OWNER = "You cannot assign a role to the house owner",
    ASSIGN_ROLE_SUCCESS = "Role assigned successfully",
    CANNOT_DELETE_ROLE_ASSIGNED_TO_USER = "Cannot delete role because it is assigned to another user",
    ROOM_ALREADY_EXISTS = "Room already exists",
    ROOM_NOT_FOUND = "Room not found",
    NO_ROOMS_FOUND = "No rooms found",
    CREATE_ROOM_SUCCESS = "Room created successfully",
    UPDATE_ROOM_SUCCESS = "Room updated successfully",
    DELETE_ROOM_SUCCESS = "Room deleted successfully",

    RENTER_ALREADY_EXISTS = "Renter already exists in this room",
    CREATE_RENTER_SUCCESS = "Renter created successfully",
    RENTER_NOT_FOUND = "Renter not found",
    NO_RENTERS_FOUND = "No renters found",
}

export default messageResponse;
