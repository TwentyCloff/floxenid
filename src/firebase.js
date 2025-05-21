import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Konfigurasi Firebase (milikmu)
const firebaseConfig = {
  apiKey: "AIzaSyDP6XNlI1jUgHN3pVWIXNZjGT3YWXKSdes",
  authDomain: "gweenlearn.firebaseapp.com",
  projectId: "gweenlearn",
  storageBucket: "gweenlearn.firebasestorage.app",
  messagingSenderId: "915816429541",
  appId: "1:915816429541:web:65c885efda4472930c210c",
  measurementId: "G-RSGBWRE6BD"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore
const db = getFirestore(app);

// Export semua yang dibutuhkan
export {
  db,
  collection,
  addDoc,
  getDocs
};
