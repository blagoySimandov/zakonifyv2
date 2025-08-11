"use client";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

export function useAttorneyRating(attorneyId: Id<"attorneys">) {
  return useQuery(api.reviews.getAverageRating, { attorneyId });
}

