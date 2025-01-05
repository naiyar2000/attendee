"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../app/firebase/firebaseConfig";
import { useAuthStore } from "@/app/store/authStore";

const useProtectedRoute = () => {
    const setUserData = useAuthStore(state => state.setUserData)
    const userData = useAuthStore(state => state.userData)
    useEffect(() => {
        if (typeof window === "undefined") return; // Ensure it's running on the client

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setUserData(null);
                redirect("/login"); // Redirect to login if not authenticated
            } else {
                setUserData(user);
                redirect("/"); // Redirect to login if not authenticated
            }
        });

        return () => unsubscribe();
    }, [setUserData]);

    return userData;
};

export default useProtectedRoute;
