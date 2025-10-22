import { initializeApp, ServiceAccount, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

// Re-configuring here as there are some error when I'm initialising on server
dotenv.config();

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};

// Initializing firebase admin SDK
const app = initializeApp({
  credential: cert(serviceAccount)
});

// Initializing Auth and Firestore 
export const auth = getAuth(app);
export const firestore = getFirestore(app);