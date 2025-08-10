import { type PracticeArea } from "@/constants";

export function useSearchSidebar() {
  const handlePracticeAreaClick = (area: PracticeArea) => {
    // This would typically trigger a search filter update
    // For now, we'll keep it as a placeholder
    console.log("Practice area clicked:", area);
  };

  return {
    handlePracticeAreaClick,
  };
}