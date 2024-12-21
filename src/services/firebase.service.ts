import { firebaseAdmin } from "../config/firebase.config";

class FirebaseService {
    admin: any;

    constructor() {
        this.admin = firebaseAdmin;
    }

    static async verifyToken(token: string) {
        const cleanToken = token.replace("Bearer ", "");
        return firebaseAdmin.auth().verifyIdToken(cleanToken);
    }

    static async revokeToken(uid: string) {
        return firebaseAdmin.auth().revokeRefreshTokens(uid);
    }

    static async revokeAllTokens(uid: string) {
        return firebaseAdmin.auth().revokeRefreshTokens(uid);
    }

    static async getUser(uid: string) {
        return firebaseAdmin.auth().getUser(uid);
    }
}

export default FirebaseService;
