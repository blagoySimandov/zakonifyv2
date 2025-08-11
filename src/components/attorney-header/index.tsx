import { PracticeAreaEnum } from "@/constants";
import { AttorneyLocation } from "@/types";
import { StarRating } from "../star-rating";
import { ATTORNEY_HEADER_CONSTANTS } from "./constants";
import { PRACTICE_AREA_LABELS } from "./messages";

interface AttorneyHeaderProps {
  fullName: string;
  practiceAreas: string[];
  location: AttorneyLocation;
  rating?: number;
  reviewCount?: number;
}

export function AttorneyHeader({
  fullName,
  practiceAreas,
  location,
  rating = ATTORNEY_HEADER_CONSTANTS.DEFAULT_RATING,
  reviewCount = ATTORNEY_HEADER_CONSTANTS.DEFAULT_REVIEW_COUNT,
}: AttorneyHeaderProps) {
  const displayedPracticeAreas = practiceAreas
    .slice(0, ATTORNEY_HEADER_CONSTANTS.MAX_PRACTICE_AREAS_DISPLAY)
    .map((area) => {
      // Convert string to enum if possible, otherwise use the original string
      const enumKey = Object.keys(PracticeAreaEnum).find(
        key => PracticeAreaEnum[key as keyof typeof PracticeAreaEnum] === area
      ) as keyof typeof PracticeAreaEnum;
      
      if (enumKey && PRACTICE_AREA_LABELS[PracticeAreaEnum[enumKey]]) {
        return PRACTICE_AREA_LABELS[PracticeAreaEnum[enumKey]];
      }
      
      return area; // fallback to original string if no translation found
    })
    .join(" • ");

  const practiceAreasAndLocation = `${displayedPracticeAreas} • ${location.city}`;

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h3>
      <div className="mb-2">
        <StarRating rating={rating} reviewCount={reviewCount} />
      </div>
      <div className="text-sm text-gray-600 mb-1">{practiceAreasAndLocation}</div>
    </div>
  );
}