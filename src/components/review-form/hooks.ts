"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ATTORNEY_PROFILE_MESSAGES } from "@/messages";

interface ReviewFormData {
  rating: number;
  comment: string;
}

interface ValidationErrors {
  [key: string]: string[] | undefined;
  _general?: string[];
}

export function useReviewForm(attorneyId: string) {
  const { user, isSignedIn } = useUser();
  
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    comment: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const createReviewMutation = useMutation(api.reviews.create);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!isSignedIn) {
      newErrors._general = [ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.ERRORS.LOGIN_REQUIRED];
      return false;
    }

    if (formData.rating === 0) {
      newErrors.rating = [ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.ERRORS.RATING_REQUIRED];
    } else if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = [ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.ERRORS.RATING_INVALID];
    }

    if (!formData.comment.trim()) {
      newErrors.comment = [ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.ERRORS.COMMENT_REQUIRED];
    } else if (
      formData.comment.trim().length < ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.VALIDATION.COMMENT_MIN
    ) {
      newErrors.comment = [ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.ERRORS.COMMENT_TOO_SHORT];
    } else if (
      formData.comment.trim().length > ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.VALIDATION.COMMENT_MAX
    ) {
      newErrors.comment = [ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.ERRORS.COMMENT_TOO_LONG];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = (
    field: keyof ReviewFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errors._general) {
      setErrors((prev) => ({ ...prev, _general: undefined }));
    }
  };

  const submitReview = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (!user) {
        throw new Error(ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.ERRORS.LOGIN_REQUIRED);
      }
      
      await createReviewMutation({
        attorneyId: attorneyId as Id<"attorneys">,
        rating: formData.rating,
        comment: formData.comment.trim(),
      });

      setIsSubmitted(true);
      return true;
    } catch (error) {
      console.error("Failed to submit review:", error);
      setErrors({
        _general: [
          error instanceof Error
            ? error.message
            : ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.ERRORS.SUBMIT_FAILED,
        ],
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      rating: 0,
      comment: "",
    });
    setErrors({});
    setIsSubmitting(false);
    setIsSubmitted(false);
  };

  return {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    isSignedIn,
    user,
    updateFormData,
    submitReview,
    resetForm,
  };
}
