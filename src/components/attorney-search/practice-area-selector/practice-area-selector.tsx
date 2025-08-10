"use client";

import { usePracticeAreaSelector } from "./hooks";
import { PRACTICE_AREA_SELECTOR_CONSTANTS } from "./constants";
import { PRACTICE_AREA_SELECTOR_MESSAGES } from "./messages";
import { PRACTICE_AREAS, PRACTICE_AREA_LABELS, type PracticeArea } from "@/constants";

export function PracticeAreaSelector() {
  const { selectedPracticeArea, handlePracticeAreaChange } = usePracticeAreaSelector();

  return (
    <select 
      className={PRACTICE_AREA_SELECTOR_CONSTANTS.SELECT_CLASSES}
      value={selectedPracticeArea}
      onChange={handlePracticeAreaChange}
    >
      <option value="">
        {PRACTICE_AREA_SELECTOR_MESSAGES.PLACEHOLDER}
      </option>
      {PRACTICE_AREAS.map((area: PracticeArea) => (
        <option key={area} value={area}>
          {PRACTICE_AREA_LABELS[area]}
        </option>
      ))}
    </select>
  );
}