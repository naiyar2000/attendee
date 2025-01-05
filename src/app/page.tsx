"use client";
import { DatePicker } from "@/components/ui/datepicker";
import useProtectedRoute from "@/hooks/useProtectedRoutes";
import { useEffect, useState } from "react";
import CourseList from "./CourseList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import AddCourse from "./AddCourse";

export default function Home() {
  useProtectedRoute();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [showAddCourse, setShowAddCourse] = useState(false);

  const handleFormClose = () => {
    setShowAddCourse(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between pt-4 gap-2">
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={(date) => { setSelectedDate(date || new Date()) }}
        />
        <Button variant={"outline"} onClick={() => setShowAddCourse(true)}>
          <Plus />
          Add Course
        </Button>
      </div>
      {
        showAddCourse ? <AddCourse handleClose={handleFormClose} />
          : <CourseList selectedDate={selectedDate} />
      }
    </div>
  );
}
