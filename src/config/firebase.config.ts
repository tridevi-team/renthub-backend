import * as admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import serviceAccount from "../../credentials.json";
import firebaseConfig from "../../firebaseConfig.json";

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        projectId: serviceAccount.project_id,
    });
} catch (error) {
    console.error("Firebase Admin SDK initialization error:", error);
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAdmin = admin;
