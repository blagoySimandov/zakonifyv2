"use client";

import { COMMON_TIMEZONES } from "@/constants/availability";
import { Globe } from "lucide-react";

interface TimeZoneSelectorProps {
  value: string;
  onChange: (timeZone: string) => void;
}

export function TimeZoneSelector({ value, onChange }: TimeZoneSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-500" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {COMMON_TIMEZONES.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  );
}