"use client";

import { trpc } from "@/utils";

export function useAttorneyProfile(attorneyId: string) {
  const {
    data: attorney,
    isLoading: attorneyLoading,
    error: attorneyError,
    refetch: refetchProfile,
  } = trpc.attorneys.getById.useQuery(
    { id: attorneyId },
    {
      enabled: !!attorneyId,
      retry: 1,
    },
  );

  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = trpc.reviews.getByAttorneyId.useQuery(
    { attorneyId },
    {
      enabled: !!attorneyId,
      retry: 1,
    },
  );

  const {
    data: ratingStats,
    isLoading: ratingLoading,
    refetch: refetchRating,
  } = trpc.reviews.getAverageRating.useQuery(
    { attorneyId },
    {
      enabled: !!attorneyId,
      retry: 1,
    },
  );

  const refetchAll = () => {
    refetchProfile();
    refetchReviews();
    refetchRating();
  };

  return {
    attorney: attorney || null,
    reviews: reviews || [],
    ratingStats: ratingStats || { averageRating: 0, totalReviews: 0 },
    isLoading: attorneyLoading || reviewsLoading || ratingLoading,
    error: attorneyError?.message || reviewsError?.message || null,
    refetchProfile,
    refetchReviews,
    refetchRating,
    refetchAll,
  };
}
