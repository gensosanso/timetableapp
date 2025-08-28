"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Calendar, User, School } from "lucide-react";

type ViewType = "class" | "teacher" | "school";

interface ViewSelectorProps {
  viewType?: ViewType;
  selectedEntity?: string;
  onViewChange?: (type: ViewType, entity?: string) => void;
  onEntityChange?: (entityId: string) => void;
  onSave?: () => void;
  classes?: { id: string; name: string }[];
  teachers?: { id: string; name: string }[];
}

export default function ViewSelector({
  viewType = "class",
  selectedEntity = "",
  onViewChange = () => {},
  onEntityChange = () => {},
  onSave = () => {},
  classes = [
    { id: "1", name: "CP - Classe 1" },
    { id: "2", name: "CE1 - Classe 2" },
    { id: "3", name: "CE2 - Classe 3" },
    { id: "4", name: "CM1 - Classe 4" },
    { id: "5", name: "CM2 - Classe 5" },
  ],
  teachers = [
    { id: "1", name: "Mme Dupont" },
    { id: "2", name: "M. Martin" },
    { id: "3", name: "Mme Bernard" },
    { id: "4", name: "M. Thomas" },
  ],
}: ViewSelectorProps) {
  const [currentView, setCurrentView] = useState<ViewType>(viewType);
  const [selectedEntityId, setSelectedEntityId] = useState<string>(
    selectedEntity || classes[0]?.id || "",
  );

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    let newEntityId = "";
    if (view === "class" && classes.length > 0) {
      newEntityId = classes[0].id;
      setSelectedEntityId(newEntityId);
      onEntityChange(newEntityId);
    } else if (view === "teacher" && teachers.length > 0) {
      newEntityId = teachers[0].id;
      setSelectedEntityId(newEntityId);
      onEntityChange(newEntityId);
    } else {
      setSelectedEntityId("");
      onEntityChange("");
    }
    onViewChange(view, newEntityId);
  };

  const handleEntityChange = (value: string) => {
    setSelectedEntityId(value);
    onEntityChange(value);
  };

  return (
    <div className="w-full bg-background border-b flex items-center justify-between px-4 py-2 h-[60px]">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={currentView === "class" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("class")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Par classe
          </Button>
          <Button
            variant={currentView === "teacher" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("teacher")}
          >
            <User className="h-4 w-4 mr-2" />
            Par enseignant
          </Button>
          <Button
            variant={currentView === "school" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("school")}
          >
            <School className="h-4 w-4 mr-2" />
            Vue établissement
          </Button>
        </div>

        {currentView === "class" && (
          <Select value={selectedEntityId} onValueChange={handleEntityChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sélectionner une classe" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {currentView === "teacher" && (
          <Select value={selectedEntityId} onValueChange={handleEntityChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sélectionner un enseignant" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Button onClick={onSave} variant="outline" size="sm">
        <Save className="h-4 w-4 mr-2" />
        Enregistrer
      </Button>
    </div>
  );
}
