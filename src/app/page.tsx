"use client";
import { DatePicker } from "@/components/ui/datepicker";
import useProtectedRoute from "@/hooks/useProtectedRoutes";
import { useEffect, useState } from "react";
import CourseList from "./CourseList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import AddCourse from "./AddCourse";
import { useAuthStore } from "./store/authStore";
import LoginComponent from "@/components/LoginComponent";
import Alert from "@/components/Alert";
import { useAppStore } from "./store/appStore";

export default function Home() {

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [showAddCourse, setShowAddCourse] = useState(false);

  const handleFormClose = () => {
    setShowAddCourse(false);
  }

  const { userData, loading } = useProtectedRoute();
  const alertMessage = useAppStore(state => state.message);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-white h-[80vh]">
        <p>Loading...</p>
      </div>
    )
  }

  return userData ? (
    <div className="flex flex-col gap-4">
      {
        alertMessage && <Alert />
      }
      < div className="flex justify-between pt-4 gap-2" >
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={(date) => { setSelectedDate(date || new Date()) }}
        />
        {showAddCourse ?
          <Button variant={"outline"} onClick={() => setShowAddCourse(false)}>
            <ArrowLeft />
            Back
          </Button> :
          <Button variant={"outline"} onClick={() => setShowAddCourse(true)}>
            <Plus />
            Add Course
          </Button>
        }
      </div >
      {
        showAddCourse ? <AddCourse handleClose={handleFormClose} />
          : <CourseList selectedDate={selectedDate} />
      }
    </div >
  ) : <LoginComponent />
}
