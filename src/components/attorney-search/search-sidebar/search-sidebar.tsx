"use client";

import { useSearchSidebar } from "./hooks";
import { SEARCH_SIDEBAR_CONSTANTS } from "./constants";
import { SEARCH_SIDEBAR_MESSAGES } from "./messages";
import {
  PRACTICE_AREA_LABELS,
  PRACTICE_AREAS,
  type PracticeArea,
} from "@/constants";

export function SearchSidebar() {
  const { handlePracticeAreaClick } = useSearchSidebar();

  return (
    <div className={SEARCH_SIDEBAR_CONSTANTS.CONTAINER_CLASSES}>
      <div className={SEARCH_SIDEBAR_CONSTANTS.POPULAR_AREAS_CONTAINER_CLASSES}>
        <h3 className={SEARCH_SIDEBAR_CONSTANTS.POPULAR_AREAS_TITLE_CLASSES}>
          {SEARCH_SIDEBAR_MESSAGES.POPULAR_PRACTICE_AREAS_TITLE}
        </h3>
        <div className={SEARCH_SIDEBAR_CONSTANTS.POPULAR_AREAS_LIST_CLASSES}>
          {PRACTICE_AREAS.slice(
            0,
            SEARCH_SIDEBAR_CONSTANTS.POPULAR_AREAS_COUNT,
          ).map((area: PracticeArea) => (
            <button
              key={area}
              onClick={() => handlePracticeAreaClick(area)}
              className={SEARCH_SIDEBAR_CONSTANTS.PRACTICE_AREA_BUTTON_CLASSES}
            >
              {PRACTICE_AREA_LABELS[area]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
