import { User } from "firebase/auth";
import { create } from "zustand";
import { devtools } from 'zustand/middleware'


type AppStore = {
    type: 'success' | 'error' | 'alert';
    message: string;
    onClose: () => void;
    duration?: number;
    setAlert: ({ type, message, onClose }: {
        type?: 'success' | 'error' | 'alert';
        message: string;
        onClose?: () => void;
    }) => void
}

export const useAppStore = create<AppStore>()(devtools((set) => ({
    type: 'success',
    message: "Logged In",
    onClose: () => { },
    duration: 3000,
    setAlert: ({
        message,
        type,
        onClose
    }) => {
        set(state => (
            {
                ...state,
                message,
                type: type ?? "alert",
            }
        ))
    }
})));