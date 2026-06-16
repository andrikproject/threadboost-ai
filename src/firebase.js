import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

let auth = null;
let provider = null;
let db = null;
let firebaseReady = false;

try {
  const firebaseConfig = {
    apiKey: "AIzaSyCT7U_DUMMY_KEY_REPLACE_ME",
    authDomain: "threadboost-ai.firebaseapp.com",
    projectId: "threadboost-ai",
    storageBucket: "threadboost-ai.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
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
