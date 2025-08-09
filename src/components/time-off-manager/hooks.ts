"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { TimeOffPeriod } from "@/types/availability";

interface UseTimeOffManagerReturn {
  timeOffPeriods: TimeOffPeriod[];
  isLoading: boolean;
  error: string | null;
  isAdding: boolean;
  addTimeOff: (
    data: Omit<TimeOffPeriod, "id" | "attorneyId" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateTimeOff: (id: string, data: Partial<TimeOffPeriod>) => Promise<void>;
  deleteTimeOff: (id: string) => Promise<void>;
}

export function useTimeOffManager(
  attorneyId: Id<"attorneys">,
): UseTimeOffManagerReturn {
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Query time off periods
  const timeOffData = useQuery(api.availability.getTimeOff, {
    attorneyId,
  });

  // Mutations
  const addTimeOffMutation = useMutation(api.availability.addTimeOff);

  const isLoading = timeOffData === undefined;
  const timeOffPeriods = timeOffData || [];

  const addTimeOff = async (
    data: Omit<TimeOffPeriod, "id" | "attorneyId" | "createdAt" | "updatedAt">,
  ) => {
    setIsAdding(true);
    setError(null);

    try {
      await addTimeOffMutation({
        attorneyId,
        startTime: data.startTime,
        endTime: data.endTime,
        type: data.type,
        isRecurring: data.isRecurring || false,
        recurringPattern: data.recurringPattern,
        title: data.title,
        reason: data.reason,
      });
    } catch (err) {
      setError("Failed to add time off. Please try again.");
      throw err;
    } finally {
      setIsAdding(false);
    }
  };

  const updateTimeOff = async () => {
    setError(null);

    try {
      // Note: This would need an update mutation in the API
      // For now, we'll just show an error
      throw new Error("Update functionality not yet implemented");
    } catch (err) {
      setError("Failed to update time off. Please try again.");
      throw err;
    }
  };

  const deleteTimeOff = async () => {
    setError(null);

    try {
      // Note: This would need a delete mutation in the API
      // For now, we'll just show an error
      throw new Error("Delete functionality not yet implemented");
    } catch (err) {
      setError("Failed to delete time off. Please try again.");
      throw err;
    }
  };

  return {
    timeOffPeriods,
    isLoading,
    error,
    isAdding,
    addTimeOff,
    updateTimeOff,
    deleteTimeOff,
  };
}

