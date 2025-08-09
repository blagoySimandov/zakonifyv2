"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { WeeklySchedule, ConsultationSettings } from "@/types/availability";
import { DEFAULT_WORKING_HOURS, DEFAULT_CONSULTATION_SETTINGS, WORKING_HOURS_TEMPLATES } from "@/constants/availability";

interface UseScheduleManagerReturn {
  workingHours: WeeklySchedule;
  consultationSettings: ConsultationSettings;
  timeZone: string;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  hasChanges: boolean;
  updateWorkingHours: (newSchedule: WeeklySchedule) => void;
  updateConsultationSettings: (newSettings: ConsultationSettings) => void;
  updateTimeZone: (newTimeZone: string) => void;
  saveChanges: () => Promise<void>;
  resetChanges: () => void;
  applyTemplate: (templateName: string) => void;
}

export function useScheduleManager(attorneyId: Id<"attorneys">): UseScheduleManagerReturn {
  // Query current availability profile
  const availabilityProfile = useQuery(api.availability.getAvailabilityProfile, {
    attorneyId,
  });

  // Mutations
  const createOrUpdateProfile = useMutation(api.availability.createOrUpdateAvailabilityProfile);

  // Local state for editing
  const [workingHours, setWorkingHours] = useState<WeeklySchedule>(DEFAULT_WORKING_HOURS);
  const [consultationSettings, setConsultationSettings] = useState<ConsultationSettings>(DEFAULT_CONSULTATION_SETTINGS);
  const [timeZone, setTimeZone] = useState<string>('America/New_York');
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<{
    workingHours: WeeklySchedule;
    consultationSettings: ConsultationSettings;
    timeZone: string;
  } | null>(null);

  const isLoading = availabilityProfile === undefined;

  // Initialize state when profile loads
  useEffect(() => {
    if (availabilityProfile) {
      const initialWorkingHours = availabilityProfile.workingHours || DEFAULT_WORKING_HOURS;
      const initialConsultationSettings = availabilityProfile.consultationSettings || DEFAULT_CONSULTATION_SETTINGS;
      const initialTimeZone = availabilityProfile.timeZone || 'America/New_York';

      setWorkingHours(initialWorkingHours);
      setConsultationSettings(initialConsultationSettings);
      setTimeZone(initialTimeZone);
      
      setOriginalData({
        workingHours: initialWorkingHours,
        consultationSettings: initialConsultationSettings,
        timeZone: initialTimeZone,
      });
    } else if (availabilityProfile === null) {
      // No profile exists, use defaults
      setOriginalData({
        workingHours: DEFAULT_WORKING_HOURS,
        consultationSettings: DEFAULT_CONSULTATION_SETTINGS,
        timeZone: 'America/New_York',
      });
    }
  }, [availabilityProfile]);

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    if (!originalData) return false;

    return (
      JSON.stringify(workingHours) !== JSON.stringify(originalData.workingHours) ||
      JSON.stringify(consultationSettings) !== JSON.stringify(originalData.consultationSettings) ||
      timeZone !== originalData.timeZone
    );
  }, [workingHours, consultationSettings, timeZone, originalData]);

  // Update handlers
  const updateWorkingHours = useCallback((newSchedule: WeeklySchedule) => {
    setWorkingHours(newSchedule);
    setError(null);
  }, []);

  const updateConsultationSettings = useCallback((newSettings: ConsultationSettings) => {
    setConsultationSettings(newSettings);
    setError(null);
  }, []);

  const updateTimeZone = useCallback((newTimeZone: string) => {
    setTimeZone(newTimeZone);
    setError(null);
  }, []);

  // Save changes to database
  const saveChanges = useCallback(async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    setError(null);

    try {
      await createOrUpdateProfile({
        attorneyId,
        timeZone,
        workingHours,
        consultationSettings,
        isActive: true,
      });

      // Update original data to reflect saved state
      setOriginalData({
        workingHours,
        consultationSettings,
        timeZone,
      });

      // Show success message temporarily
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError('Failed to save schedule. Please try again.');
      console.error('Error saving schedule:', err);
    } finally {
      setIsSaving(false);
    }
  }, [
    hasChanges,
    attorneyId,
    timeZone,
    workingHours,
    consultationSettings,
    createOrUpdateProfile,
  ]);

  // Reset changes to original state
  const resetChanges = useCallback(() => {
    if (originalData) {
      setWorkingHours(originalData.workingHours);
      setConsultationSettings(originalData.consultationSettings);
      setTimeZone(originalData.timeZone);
      setError(null);
    }
  }, [originalData]);

  // Apply a predefined template
  const applyTemplate = useCallback((templateName: string) => {
    const template = WORKING_HOURS_TEMPLATES[templateName as keyof typeof WORKING_HOURS_TEMPLATES];
    if (template) {
      setWorkingHours(template);
      setError(null);
    }
  }, []);

  // Validation helpers
  const validateWorkingHours = useCallback((schedule: WeeklySchedule): string | null => {
    for (const [day, daySchedule] of Object.entries(schedule)) {
      if (!daySchedule) continue;

      const startTime = timeToMinutes(daySchedule.start);
      const endTime = timeToMinutes(daySchedule.end);

      if (endTime <= startTime) {
        return `${day}: End time must be after start time`;
      }

      // Validate breaks are within working hours
      if (daySchedule.breaks) {
        for (const breakPeriod of daySchedule.breaks) {
          const breakStart = timeToMinutes(breakPeriod.start);
          const breakEnd = timeToMinutes(breakPeriod.end);

          if (breakStart < startTime || breakEnd > endTime) {
            return `${day}: Break time must be within working hours`;
          }

          if (breakEnd <= breakStart) {
            return `${day}: Break end time must be after start time`;
          }
        }
      }
    }

    return null;
  }, []);

  const validateConsultationSettings = useCallback((settings: ConsultationSettings): string | null => {
    if (settings.defaultDuration < 15 || settings.defaultDuration > 240) {
      return 'Default duration must be between 15 minutes and 4 hours';
    }

    if (settings.bufferTime < 0 || settings.bufferTime > 60) {
      return 'Buffer time must be between 0 and 60 minutes';
    }

    if (settings.maxConsultationsPerDay < 1 || settings.maxConsultationsPerDay > 20) {
      return 'Maximum consultations per day must be between 1 and 20';
    }

    if (settings.minAdvanceBooking < 1) {
      return 'Minimum advance booking must be at least 1 hour';
    }

    if (settings.maxAdvanceBooking > 365) {
      return 'Maximum advance booking cannot exceed 1 year';
    }

    // Validate consultation types
    for (const consultationType of settings.consultationTypes) {
      if (consultationType.duration < 15 || consultationType.duration > 240) {
        return `${consultationType.type}: Duration must be between 15 minutes and 4 hours`;
      }

      if (consultationType.price <= 0) {
        return `${consultationType.type}: Price must be greater than 0`;
      }
    }

    return null;
  }, []);

  // Run validation on changes
  useEffect(() => {
    const scheduleError = validateWorkingHours(workingHours);
    const settingsError = validateConsultationSettings(consultationSettings);
    
    const validationError = scheduleError || settingsError;
    if (validationError && !error?.includes('Failed to save')) {
      setError(validationError);
    } else if (!validationError && error?.includes('must be')) {
      setError(null);
    }
  }, [workingHours, consultationSettings, validateWorkingHours, validateConsultationSettings, error]);

  return {
    workingHours,
    consultationSettings,
    timeZone,
    isLoading,
    isSaving,
    error,
    hasChanges,
    updateWorkingHours,
    updateConsultationSettings,
    updateTimeZone,
    saveChanges,
    resetChanges,
    applyTemplate,
  };
}

// Utility function to convert time string to minutes
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}