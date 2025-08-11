"use client";

import { usePracticeAreaSelector } from "./hooks";
import { PRACTICE_AREA_SELECTOR_MESSAGES } from "./messages";
import {
  PRACTICE_AREAS,
  PRACTICE_AREA_LABELS,
  type PracticeArea,
} from "@/constants";
import { Dropdown, type DropdownOption } from "@/components/ui";

interface PracticeAreaSelectorProps {
  onPracticeAreaChange?: (practiceArea: PracticeArea | "") => void;
  value?: PracticeArea | "";
  className?: string;
}

export function PracticeAreaSelector({
  onPracticeAreaChange,
  value,
  className,
}: PracticeAreaSelectorProps = {}) {
  const { selectedPracticeArea, handlePracticeAreaChange } =
    usePracticeAreaSelector({
      onPracticeAreaChange,
      value,
    });

  const practiceAreaOptions: DropdownOption[] = PRACTICE_AREAS.map(
    (area: PracticeArea) => ({
      value: area,
      label: PRACTICE_AREA_LABELS[area],
    }),
  );

  const handleDropdownChange = (value: string) => {
    handlePracticeAreaChange({
      target: { value },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <Dropdown
      options={practiceAreaOptions}
      value={selectedPracticeArea}
      placeholder={PRACTICE_AREA_SELECTOR_MESSAGES.PLACEHOLDER}
      onChange={handleDropdownChange}
      className={className}
      width="md"
      clearable={true}
      searchable={true}
      searchPlaceholder="Търсете правна област..."
    />
  );
}

