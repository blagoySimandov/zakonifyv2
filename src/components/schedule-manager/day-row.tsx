"use client";

import { useCallback } from "react";
import { DayOfWeek, DaySchedule } from "@/types/availability";
import { SCHEDULE_CONSTANTS } from "./constants";
import { Copy, Trash2 } from "lucide-react";
import { generateTimeOptions, calculateHours } from "./utils";

interface DayRowProps {
  day: DayOfWeek;
  schedule: DaySchedule | undefined;
  isWorking: boolean;
  onToggleWorkingDay: (day: DayOfWeek) => void;
  onUpdateDay: (day: DayOfWeek, schedule: DaySchedule | undefined) => void;
  onCopyToAllDays: (day: DayOfWeek) => void;
}

export function DayRow({
  day,
  schedule,
  isWorking,
  onToggleWorkingDay,
  onUpdateDay,
  onCopyToAllDays,
}: DayRowProps) {
  const timeOptions = generateTimeOptions();
  const dayName =
    SCHEDULE_CONSTANTS.DAYS[
      day.toUpperCase() as keyof typeof SCHEDULE_CONSTANTS.DAYS
    ];

  const handleStartTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (schedule) {
        onUpdateDay(day, { ...schedule, start: e.target.value });
      }
    },
    [day, schedule, onUpdateDay],
  );

  const handleEndTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (schedule) {
        onUpdateDay(day, { ...schedule, end: e.target.value });
      }
    },
    [day, schedule, onUpdateDay],
  );

  const handleToggleWorkingDay = useCallback(() => {
    onToggleWorkingDay(day);
  }, [day, onToggleWorkingDay]);

  const handleCopyToAllDays = useCallback(() => {
    onCopyToAllDays(day);
  }, [day, onCopyToAllDays]);

  const handleClearDay = useCallback(() => {
    onUpdateDay(day, undefined);
  }, [day, onUpdateDay]);

  return (
    <div className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-100">
      {/* Day Name */}
      <div className="col-span-2">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isWorking}
            onChange={handleToggleWorkingDay}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="font-medium text-gray-900">{dayName}</span>
        </label>
      </div>

      {/* Start Time */}
      <div className="col-span-3">
        <select
          value={schedule?.start || "09:00"}
          onChange={handleStartTimeChange}
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
          onChange={handleEndTimeChange}
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
              onClick={handleCopyToAllDays}
              className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors"
              title="Copy to all days"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearDay}
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
}
