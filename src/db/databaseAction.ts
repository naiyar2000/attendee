import { AnalyticsType } from "@/app/CourseCard";
import { CourseAttendance } from "@/app/CourseList";
import { db } from "@/app/firebase/firebaseConfig"
import { arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"

export const add_course = async ({ courseName, attendance, userId }: { courseName: string, attendance: number, userId: string }) => {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);


    if (docSnap.exists()) {
        const updatedData = docSnap.data()?.courses || [];
        updatedData.push({
            courseName: courseName,
            attendanceRequired: attendance
        });
        await updateDoc(userRef, {
            courses: updatedData
        });

        const collectionRef = collection(db, `users/${userId}/attendance`);
        const querySnapshot = await getDocs(collectionRef);

        querySnapshot.forEach(async (docSnapshot) => {
            const docRef = docSnapshot.ref;
            await updateDoc(docRef, {
                data: arrayUnion({
                    courseName: courseName,
                    attendanceRequired: attendance,
                    attended: false,
                    skipped: false,
                })
            });
        });
        return true;
    } else {
        return false;
    }

}

export const get_course = async ({ userId }: { userId: string }) => {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        return docSnap.data().courses as string[] ?? [];
    } else {
        return []
    }
}

export const add_attendance = async ({ userId, courseIndex, attended, date, skipped }: { userId: string, courseIndex?: number, attended?: boolean, skipped?: boolean, date: string }) => {
    const attendanceCollectionRef = collection(db, "users", userId, "attendance");
    const attendanceRef = doc(attendanceCollectionRef, date);
    const attendanceDocSnap = await getDoc(attendanceRef);

    const courseRef = doc(db, "users", userId);
    const courseDocSnap = await getDoc(courseRef);

    let courses: object[] = [];

    if (courseDocSnap.exists()) {
        courses = courseDocSnap.data().courses;
    }



    if (attendanceDocSnap.exists() && courseIndex !== undefined) {
        const updatedData = attendanceDocSnap.data()?.data || [];
        if (updatedData[courseIndex].skipped === updatedData[courseIndex].attended) {
            updatedData[courseIndex].skipped = false;
            updatedData[courseIndex].attended = false;
        }
        if (attended) {
            updatedData[courseIndex].attended = !updatedData[courseIndex].attended;
            if (attended) {
                updatedData[courseIndex].skipped = false;
            }
        } else {
            updatedData[courseIndex].skipped = !updatedData[courseIndex].skipped;
            if (!skipped) {
                updatedData[courseIndex].attended = false;
            }
        }
        await updateDoc(attendanceRef, {
            data: updatedData
        });
        console.log(attendanceDocSnap.data());
        return true;
    } else {
        const data = courses?.map((x: object) => ({ ...x, attended: false, skipped: false }))
        await setDoc(attendanceRef, {
            data: data
        })
        return true;
    }
}

export const getAttendanceCount = async ({ courseData, userId }: { userId?: string, courseData: CourseAttendance }) => {
    if (!userId) return;
    // const attendanceRef = collection(db, `users/${userId}/attendance`);
    const attendanceRef = collection(db, "users", userId, "attendance");
    let response: AnalyticsType = {
        currentAttendancePercentValue: 0,
        totalAttended: 0,
        totalSkipped: 0,
        unEvaluated: 0
    }
    // Query for documents where a subject's "attended" field is true
    const presentAttendanceQuery = query(
        attendanceRef,
        where("data", "array-contains", {
            attendanceRequired: courseData.attendanceRequired,
            attended: true,
            courseName: courseData.courseName,
            skipped: false
        })
    );

    const absentAttendanceQuery = query(
        attendanceRef,
        where("data", "array-contains", {
            attendanceRequired: courseData.attendanceRequired,
            attended: false,
            courseName: courseData.courseName,
            skipped: true
        })
    );

    const notEvaluatedAttendanceQuery = query(
        attendanceRef,
        where("data", "array-contains-any", [
            {
                attendanceRequired: courseData.attendanceRequired,
                attended: false,
                courseName: courseData.courseName,
                skipped: false
            },
            {
                attendanceRequired: courseData.attendanceRequired,
                attended: true,
                courseName: courseData.courseName,
                skipped: true
            },
        ])
    );

    try {
        const presentSize = (await getDocs(presentAttendanceQuery)).size;
        const absentSize = (await getDocs(absentAttendanceQuery)).size;
        const notEvaluatedSize = (await getDocs(notEvaluatedAttendanceQuery)).size;
        console.log(`Count of attended=true for ${courseData.courseName}:`, presentSize);
        response.currentAttendancePercentValue = (presentSize + absentSize) === 0 ? 0 : (presentSize / (presentSize + absentSize)) * 100;
        response.totalAttended = presentSize;
        response.totalSkipped = absentSize;
        response.unEvaluated = notEvaluatedSize;
        return response;
    } catch (error) {
        console.error("Error fetching attendance count:", error);
        return response;
    }
};
