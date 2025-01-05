import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { add_attendance, add_course } from '@/db/databaseAction';
import { FormEvent, useState } from 'react';
import { useAuthStore } from './store/authStore';

interface AddCourseProps {
    handleClose: () => void
}

const AddCourse = ({ handleClose }: AddCourseProps) => {

    const [courseName, setCourseName] = useState("");
    const [attendance, setAttendance] = useState(75);
    const userData = useAuthStore(state => state.userData);

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Form Submitted");

        add_course({
            courseName: courseName,
            attendance: attendance,
            userId: userData?.uid ?? ""
        })
    }
    return (
        <form onSubmit={handleFormSubmit} className="flex flex-col text-white gap-4 bg-glass-card">
            <div className="flex flex-col gap-2">
                <p>Course Name</p>
                <Input
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Enter name of the course" />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <p>{"Required Attendance (%)"}</p>
                    <p>{attendance}%</p>
                </div>
                <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[attendance]}
                    onValueChange={(e) => setAttendance(e[0])} />
            </div>
            <div className="flex justify-end gap-4">
                <Button variant={"secondary"} onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant={"secondary"}>Submit</Button>
            </div>
        </form>
    )
}

export default AddCourse