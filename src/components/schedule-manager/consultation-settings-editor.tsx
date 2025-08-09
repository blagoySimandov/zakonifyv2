"use client";

import { ConsultationSettings } from "@/types/availability";
import { SCHEDULE_CONSTANTS } from "./constants";

interface ConsultationSettingsEditorProps {
  settings: ConsultationSettings;
  onChange: (settings: ConsultationSettings) => void;
}

export function ConsultationSettingsEditor({}: ConsultationSettingsEditorProps) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {SCHEDULE_CONSTANTS.CONSULTATION_SETTINGS.TITLE}
        </h3>
        <p className="text-sm text-gray-600">
          {SCHEDULE_CONSTANTS.CONSULTATION_SETTINGS.SUBTITLE}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500 text-center py-8">
          Consultation settings editor coming soon...
        </p>
      </div>
    </div>
  );
}