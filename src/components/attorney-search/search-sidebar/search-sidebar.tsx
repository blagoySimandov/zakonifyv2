"use client";

import { useSearchSidebar } from "./hooks";
import { SEARCH_SIDEBAR_MESSAGES } from "./messages";
import {
  PRACTICE_AREA_LABELS,
  POPULAR_PRACTICE_AREAS,
  type PracticeArea,
} from "@/constants";

interface SearchSidebarProps {
  onPracticeAreaSelect?: (area: PracticeArea) => void;
  selectedPracticeArea?: PracticeArea | "";
}

export function SearchSidebar({
  onPracticeAreaSelect,
  selectedPracticeArea,
}: SearchSidebarProps = {}) {
  const { handlePracticeAreaClick, isAreaSelected } = useSearchSidebar({
    onPracticeAreaSelect,
    selectedPracticeArea,
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">
        {SEARCH_SIDEBAR_MESSAGES.POPULAR_PRACTICE_AREAS_TITLE}
      </h3>
      <div className="space-y-2">
        {POPULAR_PRACTICE_AREAS.map((area: PracticeArea) => (
          <button
            key={area}
            onClick={() => handlePracticeAreaClick(area)}
            className={
              isAreaSelected(area)
                ? "block w-full text-left text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded font-medium"
                : "block w-full text-left text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-2 py-1 rounded transition-colors"
            }
          >
            {PRACTICE_AREA_LABELS[area]}
          </button>
        ))}
      </div>
    </div>
  );
}
