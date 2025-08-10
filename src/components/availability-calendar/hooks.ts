"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { AvailableSlot, ConsultationType } from "@/types/availability";

interface UseAvailabilityCalendarReturn {
  availableSlots: AvailableSlot[];
  isLoading: boolean;
  error: string | null;
  nextAvailableSlot: AvailableSlot | null;
  reserveSlot: (slot: AvailableSlot, clientId?: Id<"clients">) => Promise<void>;
  releaseSlot: (slot: AvailableSlot) => Promise<void>;
  refreshAvailability: () => void;
}

export function useAvailabilityCalendar(
  attorneyId: Id<"attorneys">,
  selectedDate: Date,
  consultationType: ConsultationType,
  duration: number,
): UseAvailabilityCalendarReturn {
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Calculate date range (current week)
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Query availability for the week
  const availabilityData = useQuery(api.availability.calculateAvailability, {
    attorneyId,
    startDate: startOfWeek.getTime(),
    endDate: endOfWeek.getTime(),
    consultationType,
    duration,
  });

  // Query next available slot (for quick booking)
  const nextAvailable = useQuery(api.availability.getNextAvailableSlot, {
    attorneyId,
    consultationType,
    duration,
  });

  // Mutations
  const reserveSlotMutation = useMutation(api.availability.reserveSlot);

  const isLoading =
    availabilityData === undefined || nextAvailable === undefined;
  const availableSlots = availabilityData?.slots || [];
  const nextAvailableSlot = nextAvailable || null;

  const reserveSlot = useCallback(
    async (slot: AvailableSlot, clientId?: Id<"clients">) => {
      setError(null);

      try {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        await reserveSlotMutation({
          attorneyId,
          clientId,
          startTime: slot.startTime,
          endTime: slot.endTime,
          consultationType: slot.consultationType,
          reservedBy: sessionId,
          durationMinutes: 5, // 5-minute reservation
        });

        // Store session ID for later release
        if (typeof window !== "undefined") {
          sessionStorage.setItem(`reservation_${slot.startTime}`, sessionId);
        }
      } catch (err) {
        setError("Failed to reserve time slot. It may no longer be available.");
        throw err;
      }
    },
    [attorneyId, reserveSlotMutation],
  );

  const releaseSlot = useCallback(async (slot: AvailableSlot) => {
    setError(null);

    try {
      const sessionId =
        typeof window !== "undefined"
          ? sessionStorage.getItem(`reservation_${slot.startTime}`)
          : null;

      if (!sessionId) return;

      // Find the reservation (this would need an API method to find by session)
      // For now, we'll just clear the session storage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(`reservation_${slot.startTime}`);
      }
    } catch (err) {
      console.error("Failed to release slot:", err);
    }
  }, []);

  const refreshAvailability = useCallback(() => {
    setRefreshTrigger((prev: number) => prev + 1);
    setError(null);
  }, []);

  // Handle errors
  useEffect(() => {
    if (availabilityData === null) {
      setError("No availability data found for this attorney.");
    }
  }, [availabilityData]);

  // Auto-refresh every 30 seconds to keep availability current
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAvailability();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshAvailability]);

  return {
    availableSlots,
    isLoading,
    error,
    nextAvailableSlot,
    reserveSlot,
    releaseSlot,
    refreshAvailability,
  };
}
