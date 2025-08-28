"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyCalendarGrid from "@/components/calendar/WeeklyCalendarGrid";
import CourseSidebar from "@/components/sidebar/CourseSidebar";
import ViewSelector from "@/components/calendar/ViewSelector";

export default function Home() {
  // State for view type (class, teacher, school)
  const [viewType, setViewType] = useState<"class" | "teacher" | "school">(
    "class",
  );

  // State for selected class or teacher based on view type
  const [selectedEntity, setSelectedEntity] = useState<string>("1");

  // Mock data for unscheduled courses
  const unscheduledCourses = [
    {
      id: "1",
      subject: "Mathématiques",
      teacher: "Mme Dubois",
      class: "CP-A",
      duration: 50,
      color: "#4f46e5",
    },
    {
      id: "2",
      subject: "Français",
      teacher: "M. Martin",
      class: "CP-A",
      duration: 100,
      color: "#ef4444",
    },
    {
      id: "3",
      subject: "Sciences",
      teacher: "Mme Petit",
      class: "CP-A",
      duration: 50,
      color: "#10b981",
    },
    {
      id: "4",
      subject: "Histoire",
      teacher: "M. Bernard",
      class: "CE1-B",
      duration: 50,
      color: "#f59e0b",
    },
    {
      id: "5",
      subject: "Géographie",
      teacher: "Mme Petit",
      class: "CE1-B",
      duration: 50,
      color: "#8b5cf6",
    },
  ];

  // Mock data for scheduled courses
  const scheduledCourses = [
    {
      id: "6",
      subject: "Éducation Physique",
      teacher: "M. Leroy",
      className: "CP-A",
      day: "monday",
      startTime: "08:00",
      duration: 100,
      color: "#06b6d4",
      isScheduled: true,
    },
    {
      id: "7",
      subject: "Arts Plastiques",
      teacher: "Mme Moreau",
      className: "CP-A",
      day: "tuesday",
      startTime: "13:10",
      duration: 50,
      color: "#ec4899",
      isScheduled: true,
    },
  ];

  // Handle view change
  const handleViewChange = (
    type: "class" | "teacher" | "school",
    entity?: string,
  ) => {
    setViewType(type);
    if (entity) {
      setSelectedEntity(entity);
    } else {
      // Set default entity based on type
      setSelectedEntity(type === "class" ? "1" : type === "teacher" ? "1" : "");
    }
  };

  // Handle entity change
  const handleEntityChange = (entityId: string) => {
    setSelectedEntity(entityId);
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Action Bar */}
      <div className="border-b bg-card">
        <div className="container flex h-12 items-center justify-end">
          <div className="flex items-center gap-4">
            <Button variant="outline">Sauvegarder</Button>
            <Button>Publier</Button>
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="container py-4">
        <ViewSelector
          viewType={viewType}
          selectedEntity={selectedEntity}
          onViewChange={handleViewChange}
          onEntityChange={handleEntityChange}
        />
      </div>

      {/* Main Content */}
      <div className="container flex flex-1 gap-6 py-6">
        {/* Calendar Grid */}
        <div className="flex-1">
          <Card className="h-full bg-white p-4">
            <WeeklyCalendarGrid
              view={viewType}
              selectedFilter={selectedEntity}
              courses={scheduledCourses}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-80">
          <CourseSidebar />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          © 2023 Système de Gestion d'Emplois du Temps pour Écoles Primaires
        </div>
      </footer>
    </main>
  );
}
