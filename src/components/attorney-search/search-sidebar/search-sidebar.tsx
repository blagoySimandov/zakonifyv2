"use client";

import { useSearchSidebar } from "./hooks";
import { SEARCH_SIDEBAR_CONSTANTS } from "./constants";
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
    <div className={SEARCH_SIDEBAR_CONSTANTS.POPULAR_AREAS_CONTAINER_CLASSES}>
      <h3 className={SEARCH_SIDEBAR_CONSTANTS.POPULAR_AREAS_TITLE_CLASSES}>
        {SEARCH_SIDEBAR_MESSAGES.POPULAR_PRACTICE_AREAS_TITLE}
      </h3>
      <div className={SEARCH_SIDEBAR_CONSTANTS.POPULAR_AREAS_LIST_CLASSES}>
        {POPULAR_PRACTICE_AREAS.map((area: PracticeArea) => (
          <button
            key={area}
            onClick={() => handlePracticeAreaClick(area)}
            className={
              isAreaSelected(area)
                ? SEARCH_SIDEBAR_CONSTANTS.PRACTICE_AREA_BUTTON_SELECTED_CLASSES
                : SEARCH_SIDEBAR_CONSTANTS.PRACTICE_AREA_BUTTON_CLASSES
            }
          >
            {PRACTICE_AREA_LABELS[area]}
          </button>
        ))}
      </div>
    </div>
  );
}
