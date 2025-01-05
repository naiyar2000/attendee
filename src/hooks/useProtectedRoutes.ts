"use client";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../app/firebase/firebaseConfig";
import { useAuthStore } from "@/app/store/authStore";
import { prefix } from "@/prefix";

const useProtectedRoute = () => {
    const setUserData = useAuthStore(state => state.setUserData)
    const userData = useAuthStore(state => state.userData)
    const router = useRouter();
    useEffect(() => {
        if (typeof window === "undefined") return; // Ensure it's running on the client

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setUserData(null);
                router.push(`${prefix}/login`); // Redirect to login if not authenticated
            } else {
                setUserData(user);
                // router.push(`${prefix}/`); // Redirect to login if not authenticated
            }
        });

        return () => unsubscribe();
    }, []);

    return userData;
};

export default useProtectedRoute;
