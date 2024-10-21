interface FirebaseIdentities {
    phone?: string[];
    email?: string[];
    "google.com"?: string[];
}

interface FirebaseData {
    identities: FirebaseIdentities;
    sign_in_provider: string;
}

export interface FirebaseToken {
    iss: string;
    aud: string;
    auth_time: number;
    user_id: string;
    sub: string;
    iat: number;
    exp: number;
    phone_number?: string; // Optional, available only for phone authentication
    email?: string; // Optional, available only for Google or email authentication
    email_verified?: boolean; // Optional, only for email-based logins
    name?: string; // Optional, available for Google sign-in
    picture?: string; // Optional, available for Google sign-in
    firebase: FirebaseData;
    uid: string;
}
