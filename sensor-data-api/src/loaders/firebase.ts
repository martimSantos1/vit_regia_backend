import admin from "firebase-admin";
import path from "path";

export function initializeFirebase() {
  const serviceAccountPath = path.resolve(__dirname, "../infrastructure/firebase/service-account-key.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}
