"use client";

import { BookingStep } from "./index";
import { CheckCircle } from "lucide-react";

interface Step {
  step: BookingStep;
  label: string;
  isCompleted: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: BookingStep;
  onStepClick: (step: BookingStep) => void;
}

export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  const currentStepIndex = steps.findIndex((s) => s.step === currentStep);

  const renderStep = (step: Step, index: number) => {
    const isCurrent = step.step === currentStep;
    const isCompleted = step.isCompleted;
    const isPast = index < currentStepIndex;
    const isClickable = isPast || index === currentStepIndex + 1;

    return (
      <div key={step.step} className="flex items-center">
        <button
          onClick={() => isClickable && onStepClick(step.step)}
          disabled={!isClickable}
          className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm transition-colors ${
            isCurrent
              ? "bg-blue-600 text-white"
              : isCompleted
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
          } ${isClickable ? "hover:opacity-80 cursor-pointer" : "cursor-not-allowed"}`}
        >
          {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
        </button>

        <div className="ml-3">
          <button
            onClick={() => isClickable && onStepClick(step.step)}
            disabled={!isClickable}
            className={`text-sm font-medium transition-colors ${
              isCurrent
                ? "text-blue-600"
                : isCompleted
                  ? "text-green-600"
                  : "text-gray-500"
            } ${isClickable ? "hover:opacity-80 cursor-pointer" : "cursor-not-allowed"}`}
          >
            {step.label}
          </button>
        </div>

        {index < steps.length - 1 && (
          <div
            className={`ml-4 w-8 h-px ${
              index < currentStepIndex ? "bg-green-600" : "bg-gray-300"
            }`}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-4">{steps.map(renderStep)}</div>
  );
}
