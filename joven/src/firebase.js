// Firebase initialization
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2oBqELFCq7nXVTDKGNa2ssKE10etHtdk",
  authDomain: "awto-b8b30.firebaseapp.com",
  projectId: "awto-b8b30",
  storageBucket: "awto-b8b30.firebasestorage.app",
  messagingSenderId: "909076592021",
  appId: "1:909076592021:web:e7eea1ea9912946c72729c",
  measurementId: "G-V6K71Q2YSR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
