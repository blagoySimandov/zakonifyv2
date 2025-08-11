"use client";

import { useState } from "react";

export function useRegistrationUI() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmissionSuccess = () => {
    setIsSubmitted(true);
  };

  const resetSubmission = () => {
    setIsSubmitted(false);
  };

  return {
    isSubmitted,
    handleSubmissionSuccess,
    resetSubmission,
  };
}