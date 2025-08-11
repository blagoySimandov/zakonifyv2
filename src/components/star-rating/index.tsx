import { Star } from "lucide-react";
import { STAR_RATING_CONSTANTS } from "./constants";
import { STAR_RATING_MESSAGES } from "./messages";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: string;
  showReviewCount?: boolean;
}

export function StarRating({
  rating,
  reviewCount,
  size = STAR_RATING_CONSTANTS.DEFAULT_SIZE,
  showReviewCount = true,
}: StarRatingProps) {
  const filledStars = Math.floor(rating);
  const totalStars = STAR_RATING_CONSTANTS.MAX_RATING;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {Array.from({ length: totalStars }, (_, i) => i + 1).map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= filledStars
                ? STAR_RATING_CONSTANTS.FILLED_STAR_CLASSES
                : STAR_RATING_CONSTANTS.EMPTY_STAR_CLASSES
            }`}
          />
        ))}
      </div>
      {showReviewCount && reviewCount !== undefined && (
        <span className="text-sm text-gray-600">
          {reviewCount} {STAR_RATING_MESSAGES.REVIEWS_SUFFIX}
        </span>
      )}
    </div>
  );
}