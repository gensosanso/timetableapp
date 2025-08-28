"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GripVertical, Clock, AlertCircle } from "lucide-react";
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
}: CourseCardProps) => {
  // Convert duration to periods format (e.g., "1 période" or "2 périodes")
  const periods = Math.round(duration / 50);
  const formattedDuration = periods === 1 ? "1 période" : `${periods} périodes`;
  const detailedDuration = `${duration} min`;

  return (
    <Card
      className={cn(
        "relative flex flex-col p-3 cursor-grab active:cursor-grabbing transition-all bg-white",
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

      {/* Course content */}
      <div className="flex flex-col h-full justify-between">
        <div>
          <h3 className="font-medium text-sm truncate">{subject}</h3>
          <p className="text-xs text-gray-600 truncate">{teacher}</p>
          <p className="text-xs text-gray-500 truncate">{className}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col text-xs text-gray-500">
            <div className="flex items-center">
              <Clock size={12} className="mr-1" />
              {formattedDuration}
            </div>
            <div className="text-gray-400">{detailedDuration}</div>
          </div>

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
