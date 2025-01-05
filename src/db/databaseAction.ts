import { db } from "@/app/firebase/firebaseConfig"
import { arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"

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
                    attended: false
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

export const add_attendance = async ({ userId, courseIndex, attended, date }: { userId: string, courseIndex?: number, attended?: boolean, date: string }) => {
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
        updatedData[courseIndex].attended = attended;
        await updateDoc(attendanceRef, {
            data: updatedData
        });
        console.log(attendanceDocSnap.data());
    } else {
        const data = courses?.map((x: object) => ({ ...x, attended: false }))
        await setDoc(attendanceRef, {
            data: data
        })
    }
}
