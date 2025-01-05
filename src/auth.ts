// src/auth.ts
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, provider, db } from "./app/firebase/firebaseConfig";

// Google Sign-In and Store User Data
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Create or update user document in Firestore
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date().toISOString(),
                courses: []
            });
        }

        console.log("User signed in and stored:", user);
        return user;
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error;
    }
};
