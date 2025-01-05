"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../app/firebase/firebaseConfig";
import { useAuthStore } from "@/app/store/authStore";

const useProtectedRoute = () => {
    const setUserData = useAuthStore(state => state.setUserData)
    const userData = useAuthStore(state => state.userData)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return; // Ensure it's running on the client
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setUserData(null);
            } else {
                setUserData(user);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { userData, loading };
};

export default useProtectedRoute;
