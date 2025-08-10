import { useCallback } from "react";
import { WeeklySchedule, DayOfWeek, DaySchedule } from "@/types/availability";
import { createDefaultDaySchedule } from "./utils";

interface UseWeeklyScheduleProps {
  workingHours: WeeklySchedule;
  onChange: (schedule: WeeklySchedule) => void;
}
const days: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function useWeeklySchedule({
  workingHours,
  onChange,
}: UseWeeklyScheduleProps) {
  const updateDay = useCallback(
    (day: DayOfWeek, schedule: DaySchedule | undefined) => {
      onChange({
        ...workingHours,
        [day]: schedule,
      });
    },
    [workingHours, onChange]
  );

  const toggleWorkingDay = useCallback(
    (day: DayOfWeek) => {
      if (workingHours[day]) {
        updateDay(day, undefined);
      } else {
        updateDay(day, createDefaultDaySchedule());
      }
    },
    [workingHours, updateDay]
  );

  const copyToAllDays = useCallback(
    (day: DayOfWeek) => {
      const daySchedule = workingHours[day];
      if (!daySchedule) return;

      const newSchedule = { ...workingHours };
      days.forEach((d) => {
        newSchedule[d] = { ...daySchedule };
      });
      onChange(newSchedule);
    },
    [workingHours, onChange]
  );

  return {
    days,
    updateDay,
    toggleWorkingDay,
    copyToAllDays,
  };
}
