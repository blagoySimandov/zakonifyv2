import { Save, RefreshCw, AlertCircle, Loader } from "lucide-react";
import { SCHEDULE_MESSAGES } from "./messages";

interface ScheduleManagerActionsProps {
  hasChanges: boolean;
  isSaving: boolean;
  error?: string;
  onSave: () => void;
  onReset: () => void;
}

export function ScheduleManagerActions({
  hasChanges,
  isSaving,
  error,
  onSave,
  onReset,
}: ScheduleManagerActionsProps) {
  return (
    <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center gap-3">
        {hasChanges && (
          <div className="flex items-center gap-2 text-orange-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {SCHEDULE_MESSAGES.UNSAVED_CHANGES}
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {hasChanges && (
          <button
            onClick={onReset}
            disabled={isSaving}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2 inline" />
            {SCHEDULE_MESSAGES.ACTIONS.RESET}
          </button>
        )}

        <button
          onClick={onSave}
          disabled={!hasChanges || isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {isSaving ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving
            ? SCHEDULE_MESSAGES.ACTIONS.SAVING
            : SCHEDULE_MESSAGES.ACTIONS.SAVE_CHANGES}
        </button>
      </div>
    </div>
  );
}
