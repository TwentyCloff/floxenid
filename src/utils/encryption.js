import { getApps, initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import CryptoJS from 'crypto-js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSK9RlFNDfXMAK0CnY1Pbw5WRJHMBkwY4",
  authDomain: "floxenid-api.firebaseapp.com",
  projectId: "floxenid-api",
  storageBucket: "floxenid-api.appspot.com",
  messagingSenderId: "960957637051",
  appId: "1:960957637051:web:c385383342b603f523249e",
  measurementId: "G-Q525B5DVG5"
};

// Initialize Firebase if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Get Firebase services
const auth = getAuth();
const db = getDatabase();

/**
 * Generates or retrieves encryption key for a user
 * @param {string} userId - The user's unique ID
 * @returns {Promise<string>} The encryption key
 * @throws {Error} If key retrieval/generation fails
 */
const getEncryptionKey = async (userId) => {
  try {
    // Check for existing key
    const keyRef = child(ref(db), `encryptionKeys/${userId}`);
    const snapshot = await get(keyRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    
    // Generate new key if none exists
    const newKey = CryptoJS.lib.WordArray.random(32).toString();
    await set(keyRef, newKey);
    return newKey;
    
  } catch (error) {
    console.error('Failed to get encryption key:', error);
    throw new Error('ENCRYPTION_KEY_ERROR');
  }
};

/**
 * Encrypts a message using AES-256 encryption
 * @param {string} message - The message to encrypt
 * @param {string} userId - The recipient's user ID
 * @returns {Promise<string>} The encrypted ciphertext
 * @throws {Error} If encryption fails
 */
export const encryptMessage = async (message, userId) => {
  if (!message || !userId) {
    throw new Error('INVALID_INPUT');
  }

  try {
    await signInAnonymously(auth);
    const key = await getEncryptionKey(userId);
    return CryptoJS.AES.encrypt(message, key).toString();
    
  } catch (error) {
    console.error('Failed to encrypt message:', error);
    throw new Error('ENCRYPTION_FAILED');
  }
};

/**
 * Decrypts a message using AES-256 encryption
 * @param {string} ciphertext - The encrypted message
 * @param {string} userId - The sender's user ID
 * @returns {Promise<string>} The decrypted message
 */
export const decryptMessage = async (ciphertext, userId) => {
  if (!ciphertext || !userId) {
    return '[INVALID_ENCRYPTED_MESSAGE]';
  }

  try {
    await signInAnonymously(auth);
    const key = await getEncryptionKey(userId);
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    return decrypted || '[EMPTY_MESSAGE]';
    
  } catch (error) {
    console.error('Failed to decrypt message:', error);
    return '[DECRYPTION_FAILED]';
  }
};