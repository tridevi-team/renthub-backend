export interface AccessTokenPayload {
    id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    status: boolean;
}

export interface RefreshTokenPayload {
    id: string;
    email: string;
    role: string;
    status: boolean;
}

export interface AccessTokenRenterPayload {
    id: string;
    email: string;
    phoneNumber: string;
    roomId: string;
    role: string;
}

export interface RefreshTokenRenterPayload {
    id: string;
    name: string;
    roomId: string;
    role: string;
}
