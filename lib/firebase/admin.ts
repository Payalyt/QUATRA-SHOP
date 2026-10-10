import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!getApps().length) {
  if (serviceAccountKey) {
    try {
      const parsedKey = JSON.parse(serviceAccountKey);
      adminApp = initializeApp({
        credential: cert(parsedKey),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'quatra-661a2'
      });
      adminDb = getFirestore(adminApp);
      adminAuth = getAuth(adminApp);
    } catch {
      adminApp = null;
      adminDb = null;
      adminAuth = null;
    }
  }
} else {
  adminApp = getApps()[0];
  try {
    adminDb = getFirestore(adminApp);
    adminAuth = getAuth(adminApp);
  } catch {
    adminDb = null;
    adminAuth = null;
  }
}

export { adminDb, adminApp, adminAuth };
