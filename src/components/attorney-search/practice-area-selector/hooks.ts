import { useState } from "react";
import { type PracticeArea } from "@/constants";

export function usePracticeAreaSelector() {
  const [selectedPracticeArea, setSelectedPracticeArea] = useState<PracticeArea | "">("");

  const handlePracticeAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPracticeArea(event.target.value as PracticeArea);
  };

  return {
    selectedPracticeArea,
    handlePracticeAreaChange,
  };
}