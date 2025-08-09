"use client";

import { WeeklySchedule, DayOfWeek, DaySchedule } from "@/types/availability";
import { SCHEDULE_CONSTANTS } from "./constants";
import { Clock, Copy, Trash2 } from "lucide-react";

interface WeeklyScheduleEditorProps {
  workingHours: WeeklySchedule;
  onChange: (schedule: WeeklySchedule) => void;
  timeZone: string;
}

export function WeeklyScheduleEditor({
  workingHours,
  onChange,
  timeZone,
}: WeeklyScheduleEditorProps) {
  const days: DayOfWeek[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const displayTime = formatTime(timeString);
        options.push({ value: timeString, label: displayTime });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const updateDay = (day: DayOfWeek, schedule: DaySchedule | undefined) => {
    onChange({
      ...workingHours,
      [day]: schedule,
    });
  };

  const toggleWorkingDay = (day: DayOfWeek) => {
    if (workingHours[day]) {
      updateDay(day, undefined);
    } else {
      updateDay(day, {
        start: "09:00",
        end: "17:00",
        breaks: [{ start: "12:00", end: "13:00" }],
      });
    }
  };

  const copyToAllDays = (day: DayOfWeek) => {
    const daySchedule = workingHours[day];
    if (!daySchedule) return;

    const newSchedule = { ...workingHours };
    days.forEach((d) => {
      newSchedule[d] = { ...daySchedule };
    });
    onChange(newSchedule);
  };

  const renderDayRow = (day: DayOfWeek) => {
    const schedule = workingHours[day];
    const dayName =
      SCHEDULE_CONSTANTS.DAYS[
        day.toUpperCase() as keyof typeof SCHEDULE_CONSTANTS.DAYS
      ];
    const isWorking = !!schedule;

    return (
      <div
        key={day}
        className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-100"
      >
        {/* Day Name */}
        <div className="col-span-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isWorking}
              onChange={() => toggleWorkingDay(day)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">{dayName}</span>
          </label>
        </div>

        {/* Start Time */}
        <div className="col-span-3">
          <select
            value={schedule?.start || "09:00"}
            onChange={(e) =>
              schedule && updateDay(day, { ...schedule, start: e.target.value })
            }
            disabled={!isWorking}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          >
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* End Time */}
        <div className="col-span-3">
          <select
            value={schedule?.end || "17:00"}
            onChange={(e) =>
              schedule && updateDay(day, { ...schedule, end: e.target.value })
            }
            disabled={!isWorking}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          >
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Total Hours */}
        <div className="col-span-2 text-center">
          {isWorking && schedule ? (
            <span className="text-sm font-medium text-gray-600">
              {calculateHours(schedule.start, schedule.end)}h
            </span>
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </div>

        {/* Actions */}
        <div className="col-span-2 flex justify-end gap-2">
          {isWorking && (
            <>
              <button
                onClick={() => copyToAllDays(day)}
                className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors"
                title="Copy to all days"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateDay(day, undefined)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
                title="Clear day"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {SCHEDULE_CONSTANTS.SCHEDULE_EDITOR.TITLE}
        </h3>
        <p className="text-sm text-gray-600">
          {SCHEDULE_CONSTANTS.SCHEDULE_EDITOR.SUBTITLE}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 items-center py-3 px-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div className="col-span-2">Day</div>
          <div className="col-span-3">Start Time</div>
          <div className="col-span-3">End Time</div>
          <div className="col-span-2 text-center">Hours</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Day Rows */}
        <div className="px-4">{days.map(renderDayRow)}</div>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <Clock className="w-4 h-4" />
          <span className="font-medium">Weekly Summary</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-600">Total Hours: </span>
            <span className="font-medium">
              {calculateWeeklyHours(workingHours)}h
            </span>
          </div>
          <div>
            <span className="text-blue-600">Working Days: </span>
            <span className="font-medium">
              {Object.values(workingHours).filter(Boolean).length}
            </span>
          </div>
          <div>
            <span className="text-blue-600">Time Zone: </span>
            <span className="font-medium">{timeZone.replace("_", " ")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function calculateHours(start: string, end: string): number {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return Math.round(((endMinutes - startMinutes) / 60) * 100) / 100;
}

function calculateWeeklyHours(schedule: WeeklySchedule): number {
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

