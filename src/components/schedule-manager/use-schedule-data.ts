import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { WeeklySchedule, ConsultationSettings } from "@/types/availability";
import {
  DEFAULT_WORKING_HOURS,
  DEFAULT_CONSULTATION_SETTINGS,
} from "@/constants/availability";
import { DEFAULTS } from "./constants";

interface UseScheduleDataReturn {
  workingHours: WeeklySchedule;
  consultationSettings: ConsultationSettings;
  timeZone: string;
  isLoading: boolean;
  originalData: {
    workingHours: WeeklySchedule;
    consultationSettings: ConsultationSettings;
    timeZone: string;
  } | null;
  setWorkingHours: (schedule: WeeklySchedule) => void;
  setConsultationSettings: (settings: ConsultationSettings) => void;
  setTimeZone: (timeZone: string) => void;
}

export function useScheduleData(
  attorneyId: Id<"attorneys">,
): UseScheduleDataReturn {
  const availabilityProfile = useQuery(
    api.availability.getAvailabilityProfile,
    {
      attorneyId,
    },
  );

  const isLoading = availabilityProfile === undefined;

  const [workingHours, setWorkingHours] = useState<WeeklySchedule>(
    DEFAULT_WORKING_HOURS,
  );
  const [consultationSettings, setConsultationSettings] =
    useState<ConsultationSettings>(DEFAULT_CONSULTATION_SETTINGS);
  const [timeZone, setTimeZone] = useState<string>(DEFAULTS.TIMEZONE);

  const originalData = useMemo(() => {
    if (availabilityProfile === null) {
      return {
        workingHours: DEFAULT_WORKING_HOURS,
        consultationSettings: DEFAULT_CONSULTATION_SETTINGS,
        timeZone: DEFAULTS.TIMEZONE,
      };
    }

    if (availabilityProfile) {
      return {
        workingHours: (availabilityProfile.workingHours ||
          DEFAULT_WORKING_HOURS) as WeeklySchedule,
        consultationSettings: (availabilityProfile.consultationSettings ||
          DEFAULT_CONSULTATION_SETTINGS) as ConsultationSettings,
        timeZone: availabilityProfile.timeZone || DEFAULTS.TIMEZONE,
      };
    }

    return null;
  }, [availabilityProfile]);

  return {
    workingHours,
    consultationSettings,
    timeZone,
    isLoading,
    originalData,
    setWorkingHours,
    setConsultationSettings,
    setTimeZone,
  };
}
