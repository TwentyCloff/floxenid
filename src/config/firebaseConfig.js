import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  onSnapshot, 
  or,
  setDoc,
  doc
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSK9RlFNDfXMAK0CnY1Pbw5WRJHMBkwY4",
  authDomain: "floxenid-api.firebaseapp.com",
  projectId: "floxenid-api",
  storageBucket: "floxenid-api.appspot.com",
  messagingSenderId: "960957637051",
  appId: "1:960957637051:web:c385383342b603f523249e",
  measurementId: "G-Q525B5DVG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Export all Firebase features that might be needed
export { 
  app,
  db,
  storage,
  auth,
  // Firestore functions
  collection,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  or,
  setDoc,
  doc,
  // Auth functions
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
};