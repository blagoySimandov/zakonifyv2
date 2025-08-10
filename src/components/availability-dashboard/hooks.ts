"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  AttorneyAvailabilityProfile,
  AvailabilityStats,
  DayOfWeek,
} from "@/types/availability";
import { daysOfWeek } from "@/constants/time";

interface UseAvailabilityDashboardReturn {
  availabilityProfile: AttorneyAvailabilityProfile | null;
  upcomingConsultations: Array<{
    id: string;
    startTime: number;
    endTime: number;
    type: string;
    clientName: string;
    topic?: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    price: number;
    duration: number;
  }>;
  availabilityStats: AvailabilityStats | null;
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  toggleOnlineStatus: () => void;
  refreshData: () => void;
}

export function useAvailabilityDashboard(
  attorneyId: Id<"attorneys">,
): UseAvailabilityDashboardReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const availabilityProfile = useQuery(
    api.availability.getAvailabilityProfile,
    {
      attorneyId,
    },
  );

  const upcomingConsultations = useQuery(
    api.consultations.getUpcomingConsultations,
    {
      attorneyId,
      days: 7,
    },
  );

  const updateAvailabilityStatus = useMutation(
    api.availability.updateAvailabilityStatus,
  );

  const isLoading = useMemo(() => {
    return (
      availabilityProfile === undefined || upcomingConsultations === undefined
    );
  }, [availabilityProfile, upcomingConsultations]);

  const availabilityStats = useMemo(() => {
    if (!availabilityProfile || !upcomingConsultations) return null;

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const consultationsToday = upcomingConsultations.filter(
      (consultation) =>
        consultation.startTime >= startOfToday.getTime() &&
        consultation.startTime < endOfToday.getTime(),
    ).length;

    const bookingsThisWeek = upcomingConsultations.filter(
      (consultation) =>
        consultation.startTime >= startOfWeek.getTime() &&
        consultation.startTime < endOfWeek.getTime(),
    ).length;

    const todayDayOfWeek = daysOfWeek[
      today.getDay()
    ] as keyof typeof availabilityProfile.workingHours;
    const todaySchedule = availabilityProfile.workingHours[todayDayOfWeek];

    let availableHoursToday = 0;
    if (todaySchedule) {
      const [startHour, startMinute] = todaySchedule.start
        .split(":")
        .map(Number);
      const [endHour, endMinute] = todaySchedule.end.split(":").map(Number);

      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      let totalMinutes = endMinutes - startMinutes;

      // Subtract break time
      if ("breaks" in todaySchedule && todaySchedule.breaks) {
        for (const breakPeriod of todaySchedule.breaks) {
          const [breakStartHour, breakStartMinute] = breakPeriod.start
            .split(":")
            .map(Number);
          const [breakEndHour, breakEndMinute] = breakPeriod.end
            .split(":")
            .map(Number);
          const breakMinutes =
            breakEndHour * 60 +
            breakEndMinute -
            (breakStartHour * 60 + breakStartMinute);
          totalMinutes -= breakMinutes;
        }
      }

      // Subtract booked consultation time
      const bookedMinutesToday = upcomingConsultations
        .filter(
          (consultation) =>
            consultation.startTime >= startOfToday.getTime() &&
            consultation.startTime < endOfToday.getTime(),
        )
        .reduce((total, consultation) => total + consultation.duration, 0);

      totalMinutes -= bookedMinutesToday;
      availableHoursToday = Math.max(0, totalMinutes / 60);
    }

    // Calculate weekly utilization rate
    const weeklyWorkingHours = calculateWeeklyWorkingHours(
      availabilityProfile.workingHours,
    );
    const weeklyBookedMinutes = upcomingConsultations
      .filter(
        (consultation) =>
          consultation.startTime >= startOfWeek.getTime() &&
          consultation.startTime < endOfWeek.getTime(),
      )
      .reduce((total, consultation) => total + consultation.duration, 0);

    const utilizationRate =
      weeklyWorkingHours > 0
        ? Math.round((weeklyBookedMinutes / 60 / weeklyWorkingHours) * 100)
        : 0;

    return {
      consultationsToday,
      availableHoursToday: Math.round(availableHoursToday * 10) / 10, // Round to 1 decimal
      bookingsThisWeek,
      utilizationRate,
      totalHoursPerWeek: weeklyWorkingHours,
      averageSlotsPerDay: Math.round(
        (weeklyWorkingHours * 60) /
          availabilityProfile.consultationSettings.defaultDuration /
          7,
      ),
      peakHours: calculatePeakHours(upcomingConsultations),
      leastBookedDays: calculateLeastBookedDays(upcomingConsultations),
    };
  }, [availabilityProfile, upcomingConsultations]);

  const toggleOnlineStatus = async () => {
    try {
      const newStatus = !isOnline;
      setIsOnline(newStatus);

      if (availabilityProfile) {
        await updateAvailabilityStatus({
          attorneyId,
          isActive: newStatus,
        });
      }
    } catch {
      setError("Failed to update online status");
      setIsOnline(!isOnline); // Revert on error
    }
  };

  const refreshData = () => {
    // Query invalidation is handled automatically by Convex
    setError(null);
  };

  // Update online status when profile loads
  useEffect(() => {
    if (availabilityProfile) {
      setIsOnline(availabilityProfile.isActive);
    }
  }, [availabilityProfile]);

  return {
    availabilityProfile: availabilityProfile
      ? {
          ...availabilityProfile,
          id: availabilityProfile._id,
        }
      : null,
    upcomingConsultations: upcomingConsultations || [],
    availabilityStats,
    isLoading,
    error,
    isOnline,
    toggleOnlineStatus,
    refreshData,
  };
}

// Helper functions
function calculateWeeklyWorkingHours(
  workingHours: Record<
    string,
    {
      start: string;
      end: string;
      breaks?: Array<{ start: string; end: string }>;
    }
  > | null,
): number {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  let totalHours = 0;

  for (const day of days) {
    const schedule = workingHours?.[day];
    if (schedule) {
      const [startHour, startMinute] = schedule.start.split(":").map(Number);
      const [endHour, endMinute] = schedule.end.split(":").map(Number);

      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      let dayMinutes = endMinutes - startMinutes;

      // Subtract break time
      if ("breaks" in schedule && schedule.breaks) {
        for (const breakPeriod of schedule.breaks) {
          const [breakStartHour, breakStartMinute] = breakPeriod.start
            .split(":")
            .map(Number);
          const [breakEndHour, breakEndMinute] = breakPeriod.end
            .split(":")
            .map(Number);
          const breakMinutes =
            breakEndHour * 60 +
            breakEndMinute -
            (breakStartHour * 60 + breakStartMinute);
          dayMinutes -= breakMinutes;
        }
      }

      totalHours += dayMinutes / 60;
    }
  }

  return totalHours;
}

function calculatePeakHours(
  consultations: Array<{ startTime: number }>,
): { start: string; end: string }[] {
  const hourCounts: { [hour: number]: number } = {};

  for (const consultation of consultations) {
    const date = new Date(consultation.startTime);
    const hour = date.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  }

  // Find the hours with the most bookings
  const maxCount = Math.max(...Object.values(hourCounts));
  if (maxCount === 0) {
    // Return common peak hours as default
    return [
      { start: "09:00", end: "11:00" },
      { start: "14:00", end: "16:00" },
    ];
  }

  const peakHours = Object.keys(hourCounts)
    .filter((hour) => hourCounts[parseInt(hour)] === maxCount)
    .map((hour) => ({
      start: `${hour.padStart(2, "0")}:00`,
      end: `${(parseInt(hour) + 1).toString().padStart(2, "0")}:00`,
    }));

  return peakHours;
}

function calculateLeastBookedDays(
  consultations: Array<{ startTime: number }>,
): DayOfWeek[] {
  const dayCounts: { [day: string]: number } = {};
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  // Initialize all days with 0
  dayNames.forEach((day) => {
    dayCounts[day] = 0;
  });

  for (const consultation of consultations) {
    const date = new Date(consultation.startTime);
    const dayOfWeek = dayNames[date.getDay()];
    dayCounts[dayOfWeek]++;
  }

  // Find the days with the least bookings
  const minCount = Math.min(...Object.values(dayCounts));
  return Object.keys(dayCounts).filter(
    (day) => dayCounts[day] === minCount,
  ) as DayOfWeek[];
}
