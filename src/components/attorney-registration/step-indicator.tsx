"use client";

import { REGISTRATION_CONSTANTS } from "./constants";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex justify-between mt-4">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
              index < currentStep - 1
                ? "bg-green-500 text-white"
                : index === currentStep - 1
                  ? "bg-primary-500 text-white"
                  : "bg-gray-200 text-gray-400"
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`text-xs mt-1 text-center max-w-20 ${
              index === currentStep - 1
                ? "text-primary-600 font-medium"
                : "text-gray-400"
            }`}
          >
            {REGISTRATION_CONSTANTS.STEP_TITLES[step as keyof typeof REGISTRATION_CONSTANTS.STEP_TITLES]}
          </span>
        </div>
      ))}
    </div>
  );
}