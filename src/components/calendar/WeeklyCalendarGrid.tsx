"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CourseCard from "./CourseCard";

interface Course {
  id: string;
  subject: string;
  teacher: string;
  className: string;
  duration: number; // in minutes
  color: string;
  day?: string;
  startTime?: string;
  isScheduled?: boolean;
}

interface Teacher {
  id: string;
  name: string;
  subjects: string[];
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface WeeklyCalendarGridProps {
  courses?: Course[];
  teachers?: Teacher[];
  subjects?: Subject[];
  onCourseDrop?: (course: Course, day: string, time: string) => void;
  onCourseResize?: (course: Course, newDuration: number) => void;
  onCourseAssign?: (
    day: string,
    time: string,
    subject: Subject,
    teacher: Teacher,
  ) => void;
  view?: "class" | "teacher" | "school";
  selectedFilter?: string;
}

const WeeklyCalendarGrid = ({
  courses: initialCourses = [],
  teachers = [
    { id: "1", name: "M. Dupont", subjects: ["Mathématiques", "Sciences"] },
    { id: "2", name: "Mme Martin", subjects: ["Français", "Histoire"] },
    { id: "3", name: "M. Bernard", subjects: ["Anglais", "Géographie"] },
    { id: "4", name: "Mme Rousseau", subjects: ["Arts plastiques", "Musique"] },
    { id: "5", name: "M. Leroy", subjects: ["EPS", "Sciences"] },
  ],
  subjects = [
    { id: "1", name: "Mathématiques", color: "#4f46e5" },
    { id: "2", name: "Français", color: "#dc2626" },
    { id: "3", name: "Sciences", color: "#059669" },
    { id: "4", name: "Histoire", color: "#d97706" },
    { id: "5", name: "Géographie", color: "#7c3aed" },
    { id: "6", name: "Anglais", color: "#0891b2" },
    { id: "7", name: "Arts plastiques", color: "#be185d" },
    { id: "8", name: "Musique", color: "#65a30d" },
    { id: "9", name: "EPS", color: "#ea580c" },
  ],
  onCourseDrop = () => {},
  onCourseResize = () => {},
  onCourseAssign = () => {},
  view = "class",
  selectedFilter = "",
}: WeeklyCalendarGridProps) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedSlot, setSelectedSlot] = useState<{
    day: string;
    time: string;
  } | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = [];

  // Generate teaching periods of 50 minutes from 8:00 to 15:00
  const periods = [
    { start: "08:00", end: "08:50", label: "Période 1" },
    { start: "08:50", end: "09:40", label: "Période 2" },
    { start: "09:40", end: "10:30", label: "Période 3" },
    { start: "10:30", end: "11:00", label: "Récréation" }, // 30-minute break
    { start: "11:00", end: "11:50", label: "Période 4" },
    { start: "11:50", end: "12:40", label: "Période 5" },
    { start: "12:40", end: "13:10", label: "Déjeuner" }, // 30-minute lunch
    { start: "13:10", end: "14:00", label: "Période 6" },
    { start: "14:00", end: "14:50", label: "Période 7" },
    { start: "14:50", end: "15:00", label: "Fin" }, // 10-minute end buffer
  ];

  // Extract time slots for the grid
  periods.forEach((period) => {
    hours.push(period.start);
  });

  // Check if a time slot is during a break period
  const isBreakTime = (time: string) => {
    return time === "10:30" || time === "12:40" || time === "14:50";
  };

  // Get period info for a given time
  const getPeriodInfo = (time: string) => {
    const periods = [
      { start: "08:00", end: "08:50", label: "Période 1", isBreak: false },
      { start: "08:50", end: "09:40", label: "Période 2", isBreak: false },
      { start: "09:40", end: "10:30", label: "Période 3", isBreak: false },
      { start: "10:30", end: "11:00", label: "Récréation", isBreak: true },
      { start: "11:00", end: "11:50", label: "Période 4", isBreak: false },
      { start: "11:50", end: "12:40", label: "Période 5", isBreak: false },
      { start: "12:40", end: "13:10", label: "Déjeuner", isBreak: true },
      { start: "13:10", end: "14:00", label: "Période 6", isBreak: false },
      { start: "14:00", end: "14:50", label: "Période 7", isBreak: false },
      { start: "14:50", end: "15:00", label: "Fin", isBreak: true },
    ];
    return periods.find((p) => p.start === time);
  };

  // Find scheduled courses for a specific day and time
  const getScheduledCourse = (day: string, time: string) => {
    return courses.find(
      (course) =>
        course.day === day && course.startTime === time && course.isScheduled,
    );
  };

  // Handle drag over event
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent, day: string, time: string) => {
    e.preventDefault();
    const courseId = e.dataTransfer.getData("courseId");
    const course = courses.find((c) => c.id === courseId);

    if (course && !isBreakTime(time)) {
      onCourseDrop(course, day, time);
    }
  };

  // Handle period click
  const handlePeriodClick = (day: string, time: string) => {
    if (isBreakTime(time)) return;

    setSelectedSlot({ day, time });
    setSelectedSubject(null);
    setSelectedTeacher(null);
    setIsDialogOpen(true);
  };

  // Handle subject selection
  const handleSubjectSelect = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    setSelectedSubject(subject || null);
    setSelectedTeacher(null);
  };

  // Handle teacher selection
  const handleTeacherSelect = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    setSelectedTeacher(teacher || null);
  };

  // Handle course assignment
  const handleAssignCourse = () => {
    if (selectedSlot && selectedSubject && selectedTeacher) {
      // Create a new course object
      const newCourse: Course = {
        id: `${Date.now()}`, // Simple ID generation
        subject: selectedSubject.name,
        teacher: selectedTeacher.name,
        className: "Classe", // Default class name
        duration: 50, // 50 minutes
        color: selectedSubject.color,
        day: selectedSlot.day,
        startTime: selectedSlot.time,
        isScheduled: true,
      };

      // Add the new course to the courses array
      setCourses((prevCourses) => [...prevCourses, newCourse]);

      // Call the parent callback
      onCourseAssign(
        selectedSlot.day,
        selectedSlot.time,
        selectedSubject,
        selectedTeacher,
      );

      setIsDialogOpen(false);
      setSelectedSlot(null);
      setSelectedSubject(null);
      setSelectedTeacher(null);
    }
  };

  // Get available teachers for selected subject
  const getAvailableTeachers = () => {
    if (!selectedSubject) return [];
    return teachers.filter((teacher) =>
      teacher.subjects.includes(selectedSubject.name),
    );
  };

  return (
    <div className="bg-background border rounded-lg p-4 overflow-auto w-full h-full">
      <div className="grid grid-cols-[120px_1fr_1fr_1fr_1fr_1fr] gap-1 min-w-[1000px]">
        {/* Header row with days */}
        <div className="h-16 flex items-center justify-center font-semibold">
          Période
        </div>
        {days.map((day) => (
          <div
            key={day}
            className="h-16 flex items-center justify-center font-semibold border-b"
          >
            {day}
          </div>
        ))}

        {/* Period slots */}
        {hours.map((time) => {
          const periodInfo = getPeriodInfo(time);
          if (!periodInfo) return null;

          return (
            <React.Fragment key={time}>
              {/* Period column */}
              <div
                className={`h-20 flex flex-col items-center justify-center text-xs border-r ${periodInfo.isBreak ? "bg-gray-100 dark:bg-gray-800" : ""}`}
              >
                <div className="font-medium">{periodInfo.label}</div>
                <div className="text-gray-500">{time}</div>
                {!periodInfo.isBreak && (
                  <div className="text-gray-400">50 min</div>
                )}
              </div>

              {/* Day columns */}
              {days.map((day) => {
                const scheduledCourse = getScheduledCourse(day, time);
                const isBreak = periodInfo.isBreak;

                return (
                  <div
                    key={`${day}-${time}`}
                    className={`h-20 border border-dashed border-gray-200 dark:border-gray-700 relative ${
                      isBreak
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    }`}
                    onDragOver={!isBreak ? handleDragOver : undefined}
                    onDrop={
                      !isBreak ? (e) => handleDrop(e, day, time) : undefined
                    }
                    onClick={
                      !isBreak ? () => handlePeriodClick(day, time) : undefined
                    }
                  >
                    {scheduledCourse && time === scheduledCourse.startTime && (
                      <div
                        className="absolute left-0 right-0 z-10"
                        style={{
                          height: `${(scheduledCourse.duration / 50) * 80}px`,
                        }}
                      >
                        <CourseCard {...scheduledCourse} isPlaced={true} />
                      </div>
                    )}

                    {isBreak && (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 font-medium">
                        {periodInfo.label}
                      </div>
                    )}

                    {!isBreak && !scheduledCourse && (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 opacity-0 hover:opacity-100 transition-opacity">
                        Cliquer pour assigner
                      </div>
                    )}

                    {!isBreak && scheduledCourse && (
                      <div
                        className="absolute inset-0 rounded-md p-2 text-white text-xs flex flex-col justify-center items-center shadow-sm"
                        style={{ backgroundColor: scheduledCourse.color }}
                      >
                        <div className="font-semibold text-center leading-tight">
                          {scheduledCourse.subject}
                        </div>
                        <div className="text-center opacity-90 mt-1">
                          {scheduledCourse.teacher}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>

      {/* Course Assignment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Assigner un cours - {selectedSlot?.day} à {selectedSlot?.time}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Subject Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="subject" className="text-right font-medium">
                Matière
              </label>
              <div className="col-span-3">
                <Select onValueChange={handleSubjectSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                          {subject.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Teacher Selection */}
            {selectedSubject && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="teacher" className="text-right font-medium">
                  Enseignant
                </label>
                <div className="col-span-3">
                  <Select onValueChange={handleTeacherSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un enseignant" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTeachers().map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Assignment Button */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleAssignCourse}
                disabled={!selectedSubject || !selectedTeacher}
              >
                Assigner le cours
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyCalendarGrid;
