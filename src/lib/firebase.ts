import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * ============================================================================
 * BABU CINEMAS - FIREBASE & CLOUD FIRESTORE INITIALIZATION
 * Project ID: cinemas-97357
 * ============================================================================
 */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyC2OIK-8zko-jq3tQHlO5hPHIW2dKYOxek',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cinemas-97357.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cinemas-97357',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cinemas-97357.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '936461092322',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:936461092322:web:dbea1fdbfb5d22f01325bb',
};

// Initialize Firebase App as a singleton
export const firebaseApp: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore database instance
export const firestore: Firestore = getFirestore(firebaseApp);
export const db = firestore; // Common alias

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== ''
);
