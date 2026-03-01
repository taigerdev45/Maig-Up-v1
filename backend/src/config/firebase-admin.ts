import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
  console.warn('Missing Firebase Admin environment variables. Ensure .env is configured for production.');
} else {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: FIREBASE_CLIENT_EMAIL,
    }),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
