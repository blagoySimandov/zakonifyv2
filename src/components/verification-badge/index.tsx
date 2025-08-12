import { VERIFICATION_BADGE_CONSTANTS } from "./constants";
import { VERIFICATION_BADGE_MESSAGES } from "./messages";

interface VerificationBadgeProps {
  isVerified: boolean;
}

export function VerificationBadge({ isVerified }: VerificationBadgeProps) {
  if (!isVerified) {
    return null;
  }

  return (
    <span className={VERIFICATION_BADGE_CONSTANTS.BADGE_CLASSES}>
      {VERIFICATION_BADGE_MESSAGES.VERIFIED_TEXT}
    </span>
  );
}