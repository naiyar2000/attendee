"use client";

import { useScrollPosition } from "@/hooks/useScrollPosition";
import { prefix } from "@/prefix";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Code, Star, User, X as Delete, Home, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/firebaseConfig";
import { Button } from "./button";
import { useRouter } from "next/navigation";

const Header = () => {

    const setUserData = useAuthStore((state) => state.setUserData);
    const userData = useAuthStore((state) => state.userData);
    const router = useRouter();

    const { scrollPosition } = useScrollPosition();
    const [showOption, setShowOptions] = useState(false);


    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
            setShowOptions(false);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <>
            <div className={`w-full text-white fixed top-0 z-50`}>
                <div className={`${scrollPosition > 0 ? "bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg" : "bg-transparent"} flex justify-between items-center px-5 md:px-12 mx-2 my-2 h-16`}>
                    <div>
                        <Link href={"/"}>
                            <span className="font-bold from-neutral-400 text-2xl">Attendee</span>
                        </Link>
                    </div>
                    {
                        <div className="md:hidden" onClick={() => setShowOptions(prev => !prev)}>
                            {
                                showOption ? <Delete size={"40px"} /> : <Image
                                    src={`${prefix}/icons/hamburgerIcon.svg`}
                                    alt={"option"}
                                    width={40}
                                    height={30}
                                />
                            }
                        </div>
                    }
                    {
                        userData && <Button onClick={() => handleLogout()} variant={"secondary"} className="hidden md:flex gap-2 items-center">
                            <LogOut />
                            Log Out
                        </Button>
                    }
                </div>
            </div>
            {
                showOption ? <div className="md:hidden fixed bottom-14 right-6 z-50">
                    <div className="flex flex-col gap-2">
                        <Link href={`/`} className="flex items-center gap-2 bg-slate-200 rounded-md p-2">
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        {
                            userData && <Button onClick={() => handleLogout()} variant={"secondary"} className="flex md:hidden gap-2 items-center">
                                <LogOut />
                                Log Out
                            </Button>
                        }
                    </div>
                </div> : <div className={`${scrollPosition > 0 ? "block" : "hidden"} fixed bottom-8 right-4 z-50`}>
                    <Button variant={"secondary"} onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }}>
                        <ArrowUp />
                    </Button>
                </div>
            }
        </>
    )
}

export default Header