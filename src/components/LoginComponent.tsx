import { signInWithGoogle } from '@/auth';
import { SiGoogle } from '@icons-pack/react-simple-icons'
import React from 'react'

const LoginComponent = () => {


    const handleGoogleLogin = async () => {
        try {
            const user = await signInWithGoogle();
            if (user.emailVerified) {
                // router.push(`${prefix}/`);
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Sign in to Your Account</h2>
                </div>
                <div className="flex justify-center mb-4">
                    <p className="text-gray-600">Use Google to sign in</p>
                </div>
                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 text-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                >
                    <SiGoogle size={24} />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>)
}

export default LoginComponent