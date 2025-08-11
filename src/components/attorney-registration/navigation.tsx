"use client";

import { Button } from "@/components/ui/button";
import { REGISTRATION_CONSTANTS } from "./constants";

interface NavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function Navigation({
  isFirstStep,
  isLastStep,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit,
}: NavigationProps) {
  return (
    <div className="flex justify-between items-center">
      {!isFirstStep ? (
        <Button variant="secondary" onClick={onPrevious}>
          {REGISTRATION_CONSTANTS.BUTTONS.PREVIOUS}
        </Button>
      ) : (
        <div></div>
      )}

      {isLastStep ? (
        <Button
          variant="primary"
          size="lg"
          onClick={onSubmit}
          loading={isSubmitting}
        >
          {REGISTRATION_CONSTANTS.BUTTONS.SUBMIT}
        </Button>
      ) : (
        <Button variant="primary" size="lg" onClick={onNext}>
          {REGISTRATION_CONSTANTS.BUTTONS.NEXT}
        </Button>
      )}
    </div>
  );
}