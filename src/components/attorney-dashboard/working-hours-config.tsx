"use client";

import { ATTORNEY_DASHBOARD_MESSAGES } from "@/messages";
import { Plus, Trash2, Globe } from "lucide-react";

interface WorkingDay {
  start: string;
  end: string;
  breaks?: Array<{
    start: string;
    end: string;
  }>;
}

interface WorkingHours {
  monday?: WorkingDay;
  tuesday?: WorkingDay;
  wednesday?: WorkingDay;
  thursday?: WorkingDay;
  friday?: WorkingDay;
  saturday?: WorkingDay;
  sunday?: WorkingDay;
}

interface WorkingHoursConfigProps {
  workingHours: WorkingHours;
  timeZone: string;
  isEditing: boolean;
  onChange: (workingHours: WorkingHours, timeZone: string) => void;
}

const DAYS_OF_WEEK = [
  { key: "monday", label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.MONDAY },
  { key: "tuesday", label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.TUESDAY },
  { key: "wednesday", label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.WEDNESDAY },
  { key: "thursday", label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.THURSDAY },
  { key: "friday", label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.FRIDAY },
  { key: "saturday", label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.SATURDAY },
  { key: "sunday", label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.SUNDAY },
] as const;

const TIME_OPTIONS = Array.from({ length: 24 * 2 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
});

const TIMEZONES = [
  { value: "Europe/Sofia", label: "София (GMT+2)" },
  { value: "Europe/Athens", label: "Атина (GMT+2)" },
  { value: "Europe/London", label: "Лондон (GMT+0)" },
  { value: "Europe/Paris", label: "Париж (GMT+1)" },
  { value: "America/New_York", label: "Ню Йорк (GMT-5)" },
];

export function WorkingHoursConfig({
  workingHours,
  timeZone,
  isEditing,
  onChange,
}: WorkingHoursConfigProps) {
  const handleDayToggle = (dayKey: string) => {
    if (!isEditing) return;
    
    const newWorkingHours = { ...workingHours };
    
    if (newWorkingHours[dayKey as keyof WorkingHours]) {
      delete newWorkingHours[dayKey as keyof WorkingHours];
    } else {
      newWorkingHours[dayKey as keyof WorkingHours] = {
        start: "09:00",
        end: "17:00",
        breaks: [],
      };
    }
    
    onChange(newWorkingHours, timeZone);
  };

  const handleTimeChange = (dayKey: string, field: "start" | "end", value: string) => {
    if (!isEditing) return;
    
    const newWorkingHours = { ...workingHours };
    const day = newWorkingHours[dayKey as keyof WorkingHours];
    
    if (day) {
      newWorkingHours[dayKey as keyof WorkingHours] = {
        ...day,
        [field]: value,
      };
      onChange(newWorkingHours, timeZone);
    }
  };

  const handleAddBreak = (dayKey: string) => {
    if (!isEditing) return;
    
    const newWorkingHours = { ...workingHours };
    const day = newWorkingHours[dayKey as keyof WorkingHours];
    
    if (day) {
      const breaks = day.breaks || [];
      newWorkingHours[dayKey as keyof WorkingHours] = {
        ...day,
        breaks: [...breaks, { start: "12:00", end: "13:00" }],
      };
      onChange(newWorkingHours, timeZone);
    }
  };

  const handleRemoveBreak = (dayKey: string, breakIndex: number) => {
    if (!isEditing) return;
    
    const newWorkingHours = { ...workingHours };
    const day = newWorkingHours[dayKey as keyof WorkingHours];
    
    if (day && day.breaks) {
      const breaks = [...day.breaks];
      breaks.splice(breakIndex, 1);
      newWorkingHours[dayKey as keyof WorkingHours] = {
        ...day,
        breaks,
      };
      onChange(newWorkingHours, timeZone);
    }
  };

  const handleBreakTimeChange = (
    dayKey: string,
    breakIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    if (!isEditing) return;
    
    const newWorkingHours = { ...workingHours };
    const day = newWorkingHours[dayKey as keyof WorkingHours];
    
    if (day && day.breaks) {
      const breaks = [...day.breaks];
      breaks[breakIndex] = { ...breaks[breakIndex], [field]: value };
      newWorkingHours[dayKey as keyof WorkingHours] = {
        ...day,
        breaks,
      };
      onChange(newWorkingHours, timeZone);
    }
  };

  return (
    <div className="space-y-6">
      {/* Timezone Selection */}
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
          <Globe className="w-4 h-4" />
          <span>{ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.TIMEZONE.TITLE}</span>
        </label>
        <select
          value={timeZone}
          onChange={(e) => onChange(workingHours, e.target.value)}
          disabled={!isEditing}
          className="w-full md:w-auto px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {/* Working Hours */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.TITLE}
        </h3>
        <p className="text-gray-600 mb-6">
          {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.SUBTITLE}
        </p>

        <div className="space-y-4">
          {DAYS_OF_WEEK.map(({ key, label }) => {
            const day = workingHours[key as keyof WorkingHours];
            const isWorking = Boolean(day);

            return (
              <div key={key} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isWorking}
                      onChange={() => handleDayToggle(key)}
                      disabled={!isEditing}
                      className="w-5 h-5 text-primary-600 border-2 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50"
                    />
                    <span className="font-medium text-gray-900">{label}</span>
                  </div>
                  
                  {!isWorking && (
                    <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm font-medium rounded-full">
                      {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.CLOSED}
                    </span>
                  )}
                </div>

                {isWorking && day && (
                  <div className="space-y-4">
                    {/* Main working hours */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.START_TIME}
                        </label>
                        <select
                          value={day.start}
                          onChange={(e) => handleTimeChange(key, "start", e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.END_TIME}
                        </label>
                        <select
                          value={day.end}
                          onChange={(e) => handleTimeChange(key, "end", e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Breaks */}
                    {day.breaks && day.breaks.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.BREAK_TIME}
                        </h4>
                        <div className="space-y-3">
                          {day.breaks.map((breakTime, index) => (
                            <div key={index} className="flex items-center space-x-4 bg-white rounded-xl p-4">
                              <select
                                value={breakTime.start}
                                onChange={(e) => handleBreakTimeChange(key, index, "start", e.target.value)}
                                disabled={!isEditing}
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                              >
                                {TIME_OPTIONS.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                              
                              <span className="text-gray-500">-</span>
                              
                              <select
                                value={breakTime.end}
                                onChange={(e) => handleBreakTimeChange(key, index, "end", e.target.value)}
                                disabled={!isEditing}
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                              >
                                {TIME_OPTIONS.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                              
                              {isEditing && (
                                <button
                                  onClick={() => handleRemoveBreak(key, index)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add break button */}
                    {isEditing && (
                      <button
                        onClick={() => handleAddBreak(key)}
                        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.WORKING_HOURS.ADD_BREAK}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}