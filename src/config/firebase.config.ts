import * as admin from "firebase-admin";
import serviceAccount from "../../credentials.json";
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        projectId: serviceAccount.project_id,
    });
} catch (error) {
    console.error("Firebase Admin SDK initialization error:", error);
}

export const firebaseAdmin = admin;
