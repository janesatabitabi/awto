// firebase.js

// Firebase Initialization
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2oBqELFCq7nXVTDKGNa2ssKE10etHtdk",
  authDomain: "awto-b8b30.firebaseapp.com",
  projectId: "awto-b8b30",
  storageBucket: "awto-b8b30.appspot.com",
  messagingSenderId: "909076592021",
  appId: "1:909076592021:web:e7eea1ea9912946c72729c",
  measurementId: "G-V6K71Q2YSR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export for use in other components
export { auth, provider, db };
