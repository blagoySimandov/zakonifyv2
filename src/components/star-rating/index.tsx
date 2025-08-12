import { Star } from "lucide-react";
import { STAR_RATING_CONSTANTS } from "./constants";
import { STAR_RATING_MESSAGES } from "./messages";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: string;
  showReviewCount?: boolean;
  isLoading?: boolean;
}

export function StarRating({
  rating,
  reviewCount,
  size = STAR_RATING_CONSTANTS.DEFAULT_SIZE,
  showReviewCount = true,
  isLoading = false,
}: StarRatingProps) {
  const filledStars = Math.floor(rating);
  const hasPartialStar = rating % 1 !== 0;
  const partialStarIndex = filledStars + 1;
  const totalStars = STAR_RATING_CONSTANTS.MAX_RATING;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {Array.from({ length: totalStars }, (_, i) => {
          const starNumber = i + 1;
          const isFilled = starNumber <= filledStars;
          const isPartial = hasPartialStar && starNumber === partialStarIndex;
          
          return (
            <div key={starNumber} className="relative">
              <Star
                className={`${size} ${
                  isFilled
                    ? STAR_RATING_CONSTANTS.FILLED_STAR_CLASSES
                    : STAR_RATING_CONSTANTS.EMPTY_STAR_CLASSES
                }`}
              />
              {isPartial && (
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${(rating % 1) * 100}%` }}
                >
                  <Star
                    className={`${size} ${STAR_RATING_CONSTANTS.FILLED_STAR_CLASSES}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showReviewCount && (
        <span className="text-sm text-gray-600">
          {isLoading 
            ? STAR_RATING_MESSAGES.LOADING
            : reviewCount === 0 
              ? STAR_RATING_MESSAGES.NO_REVIEWS
              : `${reviewCount} ${STAR_RATING_MESSAGES.REVIEWS_SUFFIX}`
          }
        </span>
      )}
    </div>
  );
}