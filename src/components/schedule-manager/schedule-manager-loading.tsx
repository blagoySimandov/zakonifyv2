import { Loader } from "lucide-react";
import { SCHEDULE_MESSAGES } from "./messages";

export function ScheduleManagerLoading() {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="text-gray-600">
            {SCHEDULE_MESSAGES.LOADING_MESSAGE}
          </span>
        </div>
      </div>
    </div>
  );
}
