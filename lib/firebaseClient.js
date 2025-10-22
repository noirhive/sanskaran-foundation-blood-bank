import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDA9Bd1j8FIw1A0nKkpKYNK1mBjT27pldQ",
  authDomain: "sanskaran-bloodbank.firebaseapp.com",
  projectId: "sanskaran-bloodbank",
  storageBucket: "sanskaran-bloodbank.firebasestorage.app",
  messagingSenderId: "383654919917",
  appId: "1:383654919917:web:af07645a50780462b856e4",
  measurementId: "G-WXHD194L6B"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
export const functions = getFunctions();
