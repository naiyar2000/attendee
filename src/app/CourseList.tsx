import React from 'react'
import CourseCard from './CourseCard'
import { useAuthStore } from './store/authStore'
import useAttendanceList from '@/hooks/useAttendanceList'

export type CourseAttendance = {
    courseName: string;
    attendanceRequired: number;
    attended: boolean;
    skipped: boolean;
}

const CourseList = ({ selectedDate }: { selectedDate: Date | undefined }) => {
    const userData = useAuthStore(state => state.userData);

    let formattedDate = "";

    if (selectedDate) {
        formattedDate = `${String(selectedDate.getDate()).padStart(2, '0')}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${selectedDate.getFullYear()}`;
    }

    const attendanceCourseList1 = useAttendanceList(userData?.uid ?? "", formattedDate);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {
                attendanceCourseList1.map((item, index) => {
                    return <CourseCard key={item.courseName} index={index} courseData={item} formattedDate={formattedDate}/>
                })
            }
        </div>
    )
}

export default CourseList