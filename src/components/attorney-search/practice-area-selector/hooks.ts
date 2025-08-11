import { type PracticeArea } from "@/constants";

interface UsePracticeAreaSelectorProps {
  onPracticeAreaChange?: (practiceArea: PracticeArea | "") => void;
  value?: PracticeArea | "";
}

export function usePracticeAreaSelector({ 
  onPracticeAreaChange, 
  value = ""
}: UsePracticeAreaSelectorProps = {}) {
  const handlePracticeAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as PracticeArea;
    onPracticeAreaChange?.(newValue);
  };

  return {
    selectedPracticeArea: value,
    handlePracticeAreaChange,
  };
}