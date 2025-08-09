"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { AttorneyAvailabilityProfile, AvailabilityStats } from "@/types/availability";

interface UseAvailabilityDashboardReturn {
  availabilityProfile: AttorneyAvailabilityProfile | null;
  upcomingConsultations: Array<{
    id: string;
    startTime: number;
    endTime: number;
    type: string;
    clientName: string;
    topic?: string;
  }>;
  availabilityStats: AvailabilityStats | null;
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  toggleOnlineStatus: () => void;
  refreshData: () => void;
}

export function useAvailabilityDashboard(attorneyId: Id<"attorneys">): UseAvailabilityDashboardReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Query availability profile
  const availabilityProfile = useQuery(api.availability.getAvailabilityProfile, {
    attorneyId,
  });

  // Query upcoming consultations (next 7 days)
  const upcomingConsultations = useQuery(api.consultations.getUpcomingConsultations, {
    attorneyId,
    days: 7,
  });

  // Mutation to update availability status
  const updateAvailabilityStatus = useMutation(api.availability.updateAvailabilityStatus);

  const isLoading = useMemo(() => {
    return availabilityProfile === undefined || upcomingConsultations === undefined;
  }, [availabilityProfile, upcomingConsultations]);

  // Calculate availability stats
  const availabilityStats = useMemo(() => {
    if (!availabilityProfile || !upcomingConsultations) return null;

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Today's consultations
    const consultationsToday = upcomingConsultations.filter(consultation => 
      consultation.scheduledAt >= startOfToday.getTime() && 
      consultation.scheduledAt < endOfToday.getTime()
    ).length;

    // This week's bookings
    const bookingsThisWeek = upcomingConsultations.filter(consultation => 
      consultation.scheduledAt >= startOfWeek.getTime() && 
      consultation.scheduledAt < endOfWeek.getTime()
    ).length;

    // Calculate available hours today
    const todayDayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()] as keyof typeof availabilityProfile.workingHours;
    const todaySchedule = availabilityProfile.workingHours[todayDayOfWeek];
    
    let availableHoursToday = 0;
    if (todaySchedule) {
      const [startHour, startMinute] = todaySchedule.start.split(':').map(Number);
      const [endHour, endMinute] = todaySchedule.end.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      
      let totalMinutes = endMinutes - startMinutes;
      
      // Subtract break time
      if (todaySchedule.breaks) {
        for (const breakPeriod of todaySchedule.breaks) {
          const [breakStartHour, breakStartMinute] = breakPeriod.start.split(':').map(Number);
          const [breakEndHour, breakEndMinute] = breakPeriod.end.split(':').map(Number);
          const breakMinutes = (breakEndHour * 60 + breakEndMinute) - (breakStartHour * 60 + breakStartMinute);
          totalMinutes -= breakMinutes;
        }
      }
      
      // Subtract booked consultation time
      const bookedMinutesToday = upcomingConsultations
        .filter(consultation => 
          consultation.scheduledAt >= startOfToday.getTime() && 
          consultation.scheduledAt < endOfToday.getTime()
        )
        .reduce((total, consultation) => total + consultation.duration, 0);
      
      totalMinutes -= bookedMinutesToday;
      availableHoursToday = Math.max(0, totalMinutes / 60);
    }

    // Calculate weekly utilization rate
    const weeklyWorkingHours = calculateWeeklyWorkingHours(availabilityProfile.workingHours);
    const weeklyBookedMinutes = upcomingConsultations
      .filter(consultation => 
        consultation.scheduledAt >= startOfWeek.getTime() && 
        consultation.scheduledAt < endOfWeek.getTime()
      )
      .reduce((total, consultation) => total + consultation.duration, 0);
    
    const utilizationRate = weeklyWorkingHours > 0 ? Math.round((weeklyBookedMinutes / 60) / weeklyWorkingHours * 100) : 0;

    return {
      consultationsToday,
      availableHoursToday: Math.round(availableHoursToday * 10) / 10, // Round to 1 decimal
      bookingsThisWeek,
      utilizationRate,
      totalHoursPerWeek: weeklyWorkingHours,
      averageSlotsPerDay: Math.round(weeklyWorkingHours * 60 / availabilityProfile.consultationSettings.defaultDuration / 7),
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
      setError('Failed to update online status');
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
    availabilityProfile,
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
function calculateWeeklyWorkingHours(workingHours: Record<string, { start: string; end: string }> | null): number {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  let totalHours = 0;

  for (const day of days) {
    const schedule = workingHours[day];
    if (schedule) {
      const [startHour, startMinute] = schedule.start.split(':').map(Number);
      const [endHour, endMinute] = schedule.end.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      
      let dayMinutes = endMinutes - startMinutes;
      
      // Subtract break time
      if (schedule.breaks) {
        for (const breakPeriod of schedule.breaks) {
          const [breakStartHour, breakStartMinute] = breakPeriod.start.split(':').map(Number);
          const [breakEndHour, breakEndMinute] = breakPeriod.end.split(':').map(Number);
          const breakMinutes = (breakEndHour * 60 + breakEndMinute) - (breakStartHour * 60 + breakStartMinute);
          dayMinutes -= breakMinutes;
        }
      }
      
      totalHours += dayMinutes / 60;
    }
  }

  return totalHours;
}

function calculatePeakHours(consultations: Array<{ startTime: number }>): { start: string; end: string }[] {
  const hourCounts: { [hour: number]: number } = {};
  
  for (const consultation of consultations) {
    const date = new Date(consultation.scheduledAt);
    const hour = date.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  }

  // Find the hours with the most bookings
  const maxCount = Math.max(...Object.values(hourCounts));
  const peakHours = Object.keys(hourCounts)
    .filter(hour => hourCounts[parseInt(hour)] === maxCount)
    .map(hour => ({
      start: `${hour.padStart(2, '0')}:00`,
      end: `${(parseInt(hour) + 1).toString().padStart(2, '0')}:00`,
    }));

  return peakHours;
}

function calculateLeastBookedDays(consultations: Array<{ startTime: number }>): string[] {
  const dayCounts: { [day: string]: number } = {};
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  // Initialize all days with 0
  dayNames.forEach(day => {
    dayCounts[day] = 0;
  });

  for (const consultation of consultations) {
    const date = new Date(consultation.scheduledAt);
    const dayOfWeek = dayNames[date.getDay()];
    dayCounts[dayOfWeek]++;
  }

  // Find the days with the least bookings
  const minCount = Math.min(...Object.values(dayCounts));
  return Object.keys(dayCounts).filter(day => dayCounts[day] === minCount) as string[];
}