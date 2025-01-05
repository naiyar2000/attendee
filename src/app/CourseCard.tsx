import CircularProgressBar from '@/components/ui/circularProgressBar'
import React, { useEffect, useState } from 'react'
import { CourseAttendance } from './CourseList'
import { add_attendance, getAttendanceCount } from '@/db/databaseAction'
import { useAuthStore } from './store/authStore'

export type AnalyticsType = {
    currentAttendancePercentValue?: number;
    totalAttended?: number;
    totalSkipped?: number;
    unEvaluated?: number;
};

const CourseCard = ({ courseData, index, formattedDate }: { index: number, courseData: CourseAttendance, formattedDate: string }) => {

    const userData = useAuthStore(state => state.userData);

    const [analytics, setAnalytics] = useState<AnalyticsType>({
        currentAttendancePercentValue: 0,
        totalAttended: 0,
        totalSkipped: 0,
        unEvaluated: 0
    });

    const handleAttendance = (attended: boolean) => {
        if (!userData) return;
        let res = add_attendance({
            userId: userData?.uid ?? "",
            courseIndex: index,
            [`${attended ? "attended" : "skipped"}`]: attended,
            date: formattedDate
        })
        if (res) {
            setTimeout(() => {
                fetchAnalytics();
            }, 1000)
        }
    }

    const fetchAnalytics = async () => {
        const res = await getAttendanceCount({
            courseData: courseData,
            userId: userData?.uid,
        })
        if (res) {
            setAnalytics(res);
        }
    }

    useEffect(() => {
        fetchAnalytics();
    }, [])

    return (
        <div className={"bg-glass-card p-2 flex flex-col gap-4"}>
            <div className="flex gap-2 items-center">
                <CircularProgressBar
                    percentage={Math.floor(analytics.currentAttendancePercentValue)}
                    size={65}
                    strokeWidth={6}
                />
                <div className="flex flex-col gap-2">
                    <p className='text-lg'>{courseData.courseName}</p>
                    <p className='text-sm text-slate-500'>{`${analytics.totalAttended} attended | ${analytics.totalSkipped} missed`}</p>
                </div>
            </div>
            <div className="flex gap-4 text-black">
                <button onClick={() => handleAttendance(false)} className={`${courseData.skipped && (courseData.attended !== courseData.skipped) ? "bg-red-500" : "bg-transparent"} flex-1 rounded-sm text-white p-2 justify-center items-center flex border border-1`}>Skipped</button>
                <button onClick={() => handleAttendance(true)} className={`${courseData.attended && (courseData.attended !== courseData.skipped) ? "bg-green-500" : "bg-transparent"} flex-1 rounded-sm text-white p-2 justify-center items-center flex border border-1`}>Attended</button>
            </div>
            <div className="flex justify-between items-center text-xs">
                <p>You need to attend 0 more lectures</p>
                <div className="bg-green-500 text-white p-1 rounded-sm">
                    {`TARGET : ${courseData.attendanceRequired}%`}
                </div>
            </div>
        </div>
    )
}

export default CourseCard