import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/app/firebase/firebaseConfig";
import { CourseAttendance } from "@/app/CourseList";
import { add_attendance } from "@/db/databaseAction";

const useAttendanceList = (userId: string, date: string) => {
    const [data, setData] = useState<CourseAttendance[]>([]);

    const updateDayData = async () => {
        await add_attendance({ userId, date });
    }
    useEffect(() => {
        console.log(userId)
        console.log(date)
        if (!userId || !date) return;

        const docRef = doc(db, `users/${userId}/attendance`, date);
        const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                console.log(docSnapshot.data())
                setData(docSnapshot.data().data as CourseAttendance[]);
            } else {
                updateDayData();
                setData([]);
            }
        });

        // Cleanup subscription on unmount or date change
        return () => unsubscribe();
    }, [userId, date]);

    return data;
};

export default useAttendanceList;