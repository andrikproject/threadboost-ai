import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

let auth = null;
let provider = null;
let db = null;
let firebaseReady = false;

try {
  const firebaseConfig = {
    apiKey: "AIzaSyCtWhgoHARrXIInG4f4F3ijBxJahA8YCEs",
    authDomain: "threadboost-ai-c20b0.firebaseapp.com",
    projectId: "threadboost-ai-c20b0",
    storageBucket: "threadboost-ai-c20b0.firebasestorage.app",
    messagingSenderId: "443419275438",
    appId: "1:443419275438:web:b8e31d40e854e2d054fd3f"
  };

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
  db = getFirestore(app);
  firebaseReady = true;
} catch (e) {
  console.warn('Firebase init skipped (config placeholder):', e.message);
}

export {
  auth, provider, db, firebaseReady,
  onAuthStateChanged, signInWithPopup, signOut,
  doc, setDoc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp
};
