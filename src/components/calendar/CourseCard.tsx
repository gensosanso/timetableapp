"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GripVertical, AlertCircle, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CourseCardProps {
  id?: string;
  subject?: string;
  teacher?: string;
  className?: string;
  duration?: number; // in minutes
  color?: string;
  isDragging?: boolean;
  hasConflict?: boolean;
  isPlaced?: boolean;
  onUnassign?: (courseId: string) => void;
}

const CourseCard = ({
  id = "course-1",
  subject = "Mathématiques",
  teacher = "M. Dupont",
  className = "CE2",
  duration = 50,
  color = "#4f46e5", // Indigo color as default
  isDragging = false,
  hasConflict = false,
  isPlaced = false,
  onUnassign,
}: CourseCardProps) => {

  return (
    <Card
      className={cn(
        "relative flex flex-col p-3 cursor-grab active:cursor-grabbing transition-all bg-white group",
        isDragging && "shadow-lg opacity-75 scale-105",
        hasConflict && "ring-2 ring-red-500",
        isPlaced ? "w-full h-full" : "w-[200px] h-[100px]",
      )}
      style={{
        borderLeft: `4px solid ${color}`,
        backgroundColor: `${color}10`, // Very light version of the color
      }}
      data-course-id={id}
    >
      {/* Drag handle */}
      <div className="absolute top-2 right-2 text-gray-400">
        <GripVertical size={16} className="cursor-grab" />
      </div>

      {/* Unassign button for placed courses */}
      {isPlaced && onUnassign && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onUnassign(id || "")}
                className="absolute top-2 left-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Annuler l'assignation"
              >
                <X size={12} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Annuler l'assignation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Course content - Empty for clean display */}
      <div className="flex flex-col h-full justify-between">
        {/* Conflict indicator */}
        {hasConflict && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-red-500">
                  <AlertCircle size={16} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Conflit détecté</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Resize handle for placed courses */}
      {isPlaced && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-ns-resize">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-gray-400" />
        </div>
      )}
    </Card>
  );
};

export default CourseCard;
