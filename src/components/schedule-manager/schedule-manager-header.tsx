import { SCHEDULE_MESSAGES } from "./messages";
import { TimeZoneSelector } from "./time-zone-selector";

interface ScheduleManagerHeaderProps {
  timeZone: string | null;
  onTimeZoneChange: (timeZone: string) => void;
  onClose?: () => void;
}

export function ScheduleManagerHeader({
  timeZone,
  onTimeZoneChange,
  onClose,
}: ScheduleManagerHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {SCHEDULE_MESSAGES.TITLE}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {SCHEDULE_MESSAGES.SUBTITLE}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <TimeZoneSelector
          value={timeZone || "America/New_York"}
          onChange={onTimeZoneChange}
        />
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
            Close
          </button>
        )}
      </div>
    </div>
  );
}
