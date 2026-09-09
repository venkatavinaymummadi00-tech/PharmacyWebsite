// Firebase SDK v9+ (modular)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD0oKtCB00zUV7LK01sihnVE3TdsRWpoTQ",
  authDomain: "pharmacy-8b50c.firebaseapp.com",
  projectId: "pharmacy-8b50c",
  storageBucket: "pharmacy-8b50c.firebasestorage.app",
  messagingSenderId: "1027043002433",
  appId: "1:1027043002433:web:4f44a756462e14a3c81ec0",
  measurementId: "G-YKQ5SGJNWW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Analytics (only in browser, not SSR)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
