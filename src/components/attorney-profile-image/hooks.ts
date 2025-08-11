"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export const useAttorneyProfileImage = (
  profileImageStorageId: Id<"_storage"> | undefined,
) => {
  return useQuery(
    api.storage.getUrl,
    profileImageStorageId ? { storageId: profileImageStorageId } : "skip",
  );
};

