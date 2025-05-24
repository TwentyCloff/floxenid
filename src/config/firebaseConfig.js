// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // ✅ tambahkan ini

const firebaseConfig = {
  apiKey: "AIzaSyDP6XNlI1jUgHN3pVWIXNZjGT3YWXKSdes",
  authDomain: "gweenlearn.firebaseapp.com",
  projectId: "gweenlearn",
  storageBucket: "gweenlearn.appspot.com",
  messagingSenderId: "915816429541",
  appId: "1:915816429541:web:65c885efda4472930c210c",
  measurementId: "G-RSGBWRE6BD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // ✅ tambahkan ini

export { db, storage, auth }; // ✅ export auth juga
