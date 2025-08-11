import { PracticeAreaEnum } from "@/constants";
import { AttorneyLocation } from "@/types";
import { StarRating } from "../star-rating";
import { ATTORNEY_HEADER_CONSTANTS } from "./constants";
import { PRACTICE_AREA_LABELS } from "./messages";
import { useAttorneyRating } from "./hooks";
import { Id } from "@/../convex/_generated/dataModel";

interface AttorneyHeaderProps {
  fullName: string;
  practiceAreas: string[];
  location: AttorneyLocation;
  attorneyId: Id<"attorneys">;
}

export function AttorneyHeader({
  fullName,
  practiceAreas,
  location,
  attorneyId,
}: AttorneyHeaderProps) {
  const ratingData = useAttorneyRating(attorneyId);
  const isLoading = ratingData === undefined;
  
  const rating = ratingData?.averageRating ?? 0;
  const reviewCount = ratingData?.totalReviews ?? 0;
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
        <StarRating rating={rating} reviewCount={reviewCount} isLoading={isLoading} />
      </div>
      <div className="text-sm text-gray-600 mb-1">{practiceAreasAndLocation}</div>
    </div>
  );
}