// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAGsHo8nVs2XqGBJcvFweX90H7g3a747YY",
    authDomain: "attendancetracker-c652c.firebaseapp.com",
    projectId: "attendancetracker-c652c",
    storageBucket: "attendancetracker-c652c.firebasestorage.app",
    messagingSenderId: "46986927453",
    appId: "1:46986927453:web:6332f1ecda47dec5789cb4",
    measurementId: "G-F4ZR2QQ488"
  };

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
