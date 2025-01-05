import { User } from "firebase/auth";
import { create } from "zustand";
import { devtools } from 'zustand/middleware'


type AuthStore = {
    userData: User | null;
    setUserData: (userData: User | null) => void;
}

export const useAuthStore = create<AuthStore>()(devtools((set) => ({
    userData: null,
    setUserData: (userData: User) => set(state => ({ ...state, userData }))
})));