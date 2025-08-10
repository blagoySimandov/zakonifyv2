"use client";

import { useState, useCallback, useMemo } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { WeeklySchedule, ConsultationSettings } from "@/types/availability";
import { WORKING_HOURS_TEMPLATES } from "@/constants/availability";
import { SCHEDULE_MESSAGES } from "./messages";
import { useScheduleData } from "./use-schedule-data";
import { useValidation } from "./use-validation";

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

export function useScheduleManager(
  attorneyId: Id<"attorneys">
): UseScheduleManagerReturn {
  const {
    workingHours,
    consultationSettings,
    timeZone,
    isLoading,
    originalData,
    setWorkingHours,
    setConsultationSettings,
    setTimeZone,
  } = useScheduleData(attorneyId);

  const { validateWorkingHours, validateConsultationSettings } =
    useValidation();

  const createOrUpdateProfile = useMutation(
    api.availability.createOrUpdateAvailabilityProfile
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = useMemo(() => {
    if (!originalData) return false;

    return (
      JSON.stringify(workingHours) !==
        JSON.stringify(originalData.workingHours) ||
      JSON.stringify(consultationSettings) !==
        JSON.stringify(originalData.consultationSettings) ||
      timeZone !== originalData.timeZone
    );
  }, [workingHours, consultationSettings, timeZone, originalData]);

  const updateWorkingHours = useCallback(
    (newSchedule: WeeklySchedule) => {
      setWorkingHours(newSchedule);
      setError(null);
    },
    [setWorkingHours]
  );

  const updateConsultationSettings = useCallback(
    (newSettings: ConsultationSettings) => {
      setConsultationSettings(newSettings);
      setError(null);
    },
    [setConsultationSettings]
  );

  const updateTimeZone = useCallback(
    (newTimeZone: string) => {
      setTimeZone(newTimeZone);
      setError(null);
    },
    [setTimeZone]
  );

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

      // Show success message temporarily
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError(SCHEDULE_MESSAGES.ERROR_MESSAGES.SAVE_FAILED);
      console.error("Error saving schedule:", err);
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
  }, [originalData, setWorkingHours, setConsultationSettings, setTimeZone]);

  // Apply a predefined template
  const applyTemplate = useCallback(
    (templateName: string) => {
      const template =
        WORKING_HOURS_TEMPLATES[
          templateName as keyof typeof WORKING_HOURS_TEMPLATES
        ];
      if (template) {
        setWorkingHours(template);
        setError(null);
      }
    },
    [setWorkingHours]
  );

  // Run validation on changes
  useMemo(() => {
    const scheduleError = validateWorkingHours(workingHours);
    const settingsError = validateConsultationSettings(consultationSettings);

    const validationError = scheduleError || settingsError;
    if (validationError && !error?.includes("Failed to save")) {
      setError(validationError);
    } else if (!validationError && error?.includes("must be")) {
      setError(null);
    }
  }, [
    workingHours,
    consultationSettings,
    validateWorkingHours,
    validateConsultationSettings,
    error,
  ]);

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
