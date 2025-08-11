import { type PracticeArea } from "@/constants";

interface UseSearchSidebarProps {
  onPracticeAreaSelect?: (area: PracticeArea) => void;
  selectedPracticeArea?: PracticeArea | "";
}

export function useSearchSidebar({ 
  onPracticeAreaSelect, 
  selectedPracticeArea 
}: UseSearchSidebarProps = {}) {
  const handlePracticeAreaClick = (area: PracticeArea) => {
    onPracticeAreaSelect?.(area);
  };

  const isAreaSelected = (area: PracticeArea) => {
    return selectedPracticeArea === area;
  };

  return {
    handlePracticeAreaClick,
    isAreaSelected,
  };
}