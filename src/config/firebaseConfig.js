import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSK9RlFNDfXMAK0CnY1Pbw5WRJHMBkwY4",
  authDomain: "floxenid-api.firebaseapp.com",
  projectId: "floxenid-api",
  storageBucket: "floxenid-api.firebasestorage.app",
  messagingSenderId: "960957637051",
  appId: "1:960957637051:web:c385383342b603f523249e",
  measurementId: "G-Q525B5DVG5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
