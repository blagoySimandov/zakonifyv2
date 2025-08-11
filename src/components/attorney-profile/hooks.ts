"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export function useAttorneyProfile(attorneyId: string) {
  const attorney = useQuery(
    api.attorneys.getById, 
    !!attorneyId ? { id: attorneyId as Id<"attorneys"> } : "skip"
  );

  const reviews = useQuery(
    api.reviews.getByAttorneyId,
    !!attorneyId ? { attorneyId: attorneyId as Id<"attorneys"> } : "skip"
  );

  const ratingStats = useQuery(
    api.reviews.getAverageRating,
    !!attorneyId ? { attorneyId: attorneyId as Id<"attorneys"> } : "skip"
  );

  const attorneyLoading = attorney === undefined;
  const reviewsLoading = reviews === undefined;
  const ratingLoading = ratingStats === undefined;

  return {
    attorney: attorney || null,
    reviews: reviews || [],
    ratingStats: ratingStats || { averageRating: 0, totalReviews: 0 },
    isLoading: attorneyLoading || reviewsLoading || ratingLoading,
    error: null, // Convex handles errors differently, they throw
  };
}
