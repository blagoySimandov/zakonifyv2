"use client";

interface ProgressIndicatorProps {
  current: number;
  total: number;
  percentage: number;
  currentStepLabel?: string;
}

export function ProgressIndicator({
  current,
  total,
  percentage,
  currentStepLabel,
}: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span>
          Стъпка {current} от {total}
          {currentStepLabel && ` - ${currentStepLabel}`}
        </span>
        <span className="font-medium">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}