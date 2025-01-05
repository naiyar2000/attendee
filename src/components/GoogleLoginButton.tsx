// src/components/GoogleLoginButton.tsx
"use client";
import { signInWithGoogle } from "../auth";


const GoogleLoginButton = () => {

    const handleGoogleLogin = async () => {
        try {
            const user = await signInWithGoogle();
            if (user.emailVerified) {
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <button
            onClick={handleGoogleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Sign in with Google
        </button>
    );
};

export default GoogleLoginButton;

