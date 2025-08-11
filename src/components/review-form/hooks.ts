"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { REVIEW_FORM_CONSTANTS } from "./constants";

interface ReviewFormData {
  clientName: string;
  clientEmail: string;
  rating: number;
  comment: string;
}

interface ValidationErrors {
  [key: string]: string[] | undefined;
  _general?: string[];
}

export function useReviewForm(attorneyId: string) {
  const [formData, setFormData] = useState<ReviewFormData>({
    clientName: "",
    clientEmail: "",
    rating: 0,
    comment: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const createReviewMutation = useMutation(api.reviews.create);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = ["Client name is required"];
    } else if (formData.clientName.trim().length < 2) {
      newErrors.clientName = ["Client name must be at least 2 characters"];
    } else if (formData.clientName.trim().length > 100) {
      newErrors.clientName = ["Client name must be less than 100 characters"];
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = ["Email is required"];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = ["Please enter a valid email address"];
    }

    if (formData.rating === 0) {
      newErrors.rating = ["Please select a rating"];
    } else if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = ["Rating must be between 1 and 5 stars"];
    }

    if (!formData.comment.trim()) {
      newErrors.comment = ["Review comment is required"];
    } else if (
      formData.comment.trim().length < REVIEW_FORM_CONSTANTS.LIMITS.COMMENT_MIN
    ) {
      newErrors.comment = [
        `Comment must be at least ${REVIEW_FORM_CONSTANTS.LIMITS.COMMENT_MIN} characters`,
      ];
    } else if (
      formData.comment.trim().length > REVIEW_FORM_CONSTANTS.LIMITS.COMMENT_MAX
    ) {
      newErrors.comment = [
        `Comment must be less than ${REVIEW_FORM_CONSTANTS.LIMITS.COMMENT_MAX} characters`,
      ];
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
      await createReviewMutation({
        attorneyId: attorneyId as Id<"attorneys">,
        clientName: formData.clientName.trim(),
        clientEmail: formData.clientEmail.trim(),
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
            : "Failed to submit review. Please try again.",
        ],
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
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
    updateFormData,
    submitReview,
    resetForm,
  };
}
