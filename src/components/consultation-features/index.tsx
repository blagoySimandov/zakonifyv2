import { DollarSign, Video } from "lucide-react";
import { CONSULTATION_FEATURES_CONSTANTS } from "./constants";
import { CONSULTATION_FEATURES_MESSAGES } from "./messages";

export function ConsultationFeatures() {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className={`flex items-center gap-2 ${CONSULTATION_FEATURES_CONSTANTS.TEXT_SIZE} ${CONSULTATION_FEATURES_CONSTANTS.VIDEO_CLASSES}`}>
        <Video className={CONSULTATION_FEATURES_CONSTANTS.ICON_SIZE} />
        <span>{CONSULTATION_FEATURES_MESSAGES.VIDEO_CONSULTATIONS}</span>
      </div>
      <div className={`flex items-center gap-2 ${CONSULTATION_FEATURES_CONSTANTS.TEXT_SIZE} ${CONSULTATION_FEATURES_CONSTANTS.PRICING_CLASSES}`}>
        <DollarSign className={CONSULTATION_FEATURES_CONSTANTS.ICON_SIZE} />
        <span>{CONSULTATION_FEATURES_MESSAGES.PUBLISHED_PRICES}</span>
      </div>
    </div>
  );
}