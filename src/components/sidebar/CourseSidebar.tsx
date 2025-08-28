"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for unscheduled courses
const MOCK_CLASSES = [
  { id: "1", name: "CP-A", level: "CP" },
  { id: "2", name: "CE1-A", level: "CE1" },
  { id: "3", name: "CE2-A", level: "CE2" },
];

const MOCK_SUBJECTS = [
  { id: "1", name: "Mathématiques", color: "#4f46e5" },
  { id: "2", name: "Français", color: "#ef4444" },
  { id: "3", name: "Sciences", color: "#10b981" },
  { id: "4", name: "Histoire-Géo", color: "#f59e0b" },
  { id: "5", name: "Arts Plastiques", color: "#8b5cf6" },
];

const MOCK_TEACHERS = [
  { id: "1", firstName: "Marie", lastName: "Dupont" },
  { id: "2", firstName: "Jean", lastName: "Martin" },
  { id: "3", firstName: "Sophie", lastName: "Bernard" },
];

const MOCK_UNSCHEDULED_COURSES = [
  {
    id: "1",
    classId: "1",
    subjectId: "1",
    teacherId: "1",
    totalHours: 5,
    remainingHours: 3,
  },
  {
    id: "2",
    classId: "1",
    subjectId: "2",
    teacherId: "1",
    totalHours: 8,
    remainingHours: 4,
  },
  {
    id: "3",
    classId: "2",
    subjectId: "1",
    teacherId: "2",
    totalHours: 5,
    remainingHours: 2,
  },
  {
    id: "4",
    classId: "2",
    subjectId: "3",
    teacherId: "3",
    totalHours: 3,
    remainingHours: 3,
  },
  {
    id: "5",
    classId: "3",
    subjectId: "4",
    teacherId: "2",
    totalHours: 2,
    remainingHours: 2,
  },
];

interface CourseSidebarProps {
  onDragStart?: (course: any) => void;
}

export default function CourseSidebar({
  onDragStart = () => {},
}: CourseSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  // Group courses by class
  const coursesByClass = MOCK_UNSCHEDULED_COURSES.reduce(
    (acc, course) => {
      const classItem = MOCK_CLASSES.find((c) => c.id === course.classId);
      if (!classItem) return acc;

      if (!acc[classItem.id]) {
        acc[classItem.id] = {
          classInfo: classItem,
          courses: [],
        };
      }

      acc[classItem.id].courses.push(course);
      return acc;
    },
    {} as Record<
      string,
      {
        classInfo: (typeof MOCK_CLASSES)[0];
        courses: typeof MOCK_UNSCHEDULED_COURSES;
      }
    >,
  );

  // Filter courses based on search and filters
  const filteredCoursesByClass = Object.entries(coursesByClass).reduce(
    (acc, [classId, classData]) => {
      const filteredCourses = classData.courses.filter((course) => {
        const subject = MOCK_SUBJECTS.find((s) => s.id === course.subjectId);
        const teacher = MOCK_TEACHERS.find((t) => t.id === course.teacherId);

        const matchesSearch =
          !searchTerm ||
          subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${teacher?.firstName} ${teacher?.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesClass =
          selectedClass === "all" || course.classId === selectedClass;
        const matchesTeacher =
          selectedTeacher === "all" || course.teacherId === selectedTeacher;
        const matchesSubject =
          selectedSubject === "all" || course.subjectId === selectedSubject;

        return (
          matchesSearch && matchesClass && matchesTeacher && matchesSubject
        );
      });

      if (filteredCourses.length > 0) {
        acc[classId] = {
          classInfo: classData.classInfo,
          courses: filteredCourses,
        };
      }

      return acc;
    },
    {} as Record<
      string,
      {
        classInfo: (typeof MOCK_CLASSES)[0];
        courses: typeof MOCK_UNSCHEDULED_COURSES;
      }
    >,
  );

  // Handle drag start for a course
  const handleDragStart = (e: React.DragEvent, course: any) => {
    const subject = MOCK_SUBJECTS.find((s) => s.id === course.subjectId);
    const teacher = MOCK_TEACHERS.find((t) => t.id === course.teacherId);
    const classItem = MOCK_CLASSES.find((c) => c.id === course.classId);

    const courseData = {
      ...course,
      subject,
      teacher,
      class: classItem,
      // Default duration of 50 minutes (one period)
      duration: 50,
    };

    e.dataTransfer.setData("application/json", JSON.stringify(courseData));
    onDragStart(courseData);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedClass("all");
    setSelectedTeacher("all");
    setSelectedSubject("all");
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-l border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Cours non planifiés</h2>

        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center">
              <Filter className="h-4 w-4 mr-1" /> Filtres
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs h-7"
            >
              Réinitialiser
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                {MOCK_CLASSES.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Enseignant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les enseignants</SelectItem>
                {MOCK_TEACHERS.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les matières</SelectItem>
                {MOCK_SUBJECTS.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
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
      </div>

      {/* Course list */}
      <div className="flex-1 overflow-y-auto p-2">
        {Object.keys(filteredCoursesByClass).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
            <p>Aucun cours ne correspond aux critères sélectionnés</p>
            <Button variant="link" onClick={resetFilters} className="mt-2">
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <Accordion
            type="multiple"
            defaultValue={Object.keys(filteredCoursesByClass)}
          >
            {Object.entries(filteredCoursesByClass).map(
              ([classId, { classInfo, courses }]) => (
                <AccordionItem key={classId} value={classId}>
                  <AccordionTrigger className="hover:bg-gray-50 px-2">
                    <div className="flex items-center">
                      <span>{classInfo.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {courses.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 p-1">
                      {courses.map((course) => {
                        const subject = MOCK_SUBJECTS.find(
                          (s) => s.id === course.subjectId,
                        );
                        const teacher = MOCK_TEACHERS.find(
                          (t) => t.id === course.teacherId,
                        );

                        if (!subject || !teacher) return null;

                        return (
                          <div
                            key={course.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, course)}
                            className="p-3 rounded-md cursor-move border border-gray-200 hover:border-gray-300 active:border-primary transition-colors"
                            style={{ backgroundColor: `${subject.color}20` }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center">
                                  <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: subject.color }}
                                  />
                                  <span className="font-medium">
                                    {subject.name}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {teacher.firstName} {teacher.lastName}
                                </div>
                              </div>
                              <div className="text-xs bg-white px-2 py-1 rounded-md border">
                                {course.remainingHours}h/{course.totalHours}h
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ),
            )}
          </Accordion>
        )}
      </div>
    </div>
  );
}
