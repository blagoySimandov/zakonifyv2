import { useCallback } from "react";
import { WeeklySchedule, ConsultationSettings } from "@/types/availability";
import { SCHEDULE_MESSAGES } from "./messages";

export function useValidation() {
  const validateWorkingHours = useCallback(
    (schedule: WeeklySchedule): string | null => {
      return SCHEDULE_MESSAGES.VALIDATION_RESOLVERS.WORKING_HOURS(schedule);
    },
    [],
  );

  const validateConsultationSettings = useCallback(
    (settings: ConsultationSettings): string | null => {
      return SCHEDULE_MESSAGES.VALIDATION_RESOLVERS.CONSULTATION_SETTINGS(
        settings,
      );
    },
    [],
  );

  return {
    validateWorkingHours,
    validateConsultationSettings,
  };
}
