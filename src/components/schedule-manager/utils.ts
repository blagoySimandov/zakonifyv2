import { WeeklySchedule, DaySchedule } from "@/types/availability";

/**
 * Formats a time string (HH:MM) to a readable format (e.g., "9:00 AM")
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

/**
 * Generates time options for select dropdowns (6 AM to 10 PM, 15-minute intervals)
 */
export function generateTimeOptions() {
  const options = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const displayTime = formatTime(timeString);
      options.push({ value: timeString, label: displayTime });
    }
  }
  return options;
}

/**
 * Calculates the number of hours between two time strings
 */
export function calculateHours(start: string, end: string): number {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return Math.round(((endMinutes - startMinutes) / 60) * 100) / 100;
}

/**
 * Calculates total weekly hours from a schedule, including break deductions
 */
export function calculateWeeklyHours(schedule: WeeklySchedule): number {
  let total = 0;
  for (const daySchedule of Object.values(schedule)) {
    if (daySchedule) {
      total += calculateHours(daySchedule.start, daySchedule.end);

      // Subtract break time
      if (daySchedule.breaks) {
        for (const breakPeriod of daySchedule.breaks) {
          total -= calculateHours(breakPeriod.start, breakPeriod.end);
        }
      }
    }
  }
  return Math.round(total * 100) / 100;
}

/**
 * Creates a default day schedule
 */
export function createDefaultDaySchedule(): DaySchedule {
  return {
    start: "09:00",
    end: "17:00",
    breaks: [{ start: "12:00", end: "13:00" }],
  };
}

/**
 * Counts the number of working days in a schedule
 */
export function countWorkingDays(schedule: WeeklySchedule): number {
  return Object.values(schedule).filter(Boolean).length;
}
