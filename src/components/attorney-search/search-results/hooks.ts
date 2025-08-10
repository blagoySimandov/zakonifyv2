interface UseSearchResultsProps {
  attorneys: any[];
  isLoading: boolean;
  error: any;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
}

export function useSearchResults({ 
  attorneys,
  isLoading,
  error,
  hasActiveFilters,
  clearAllFilters 
}: UseSearchResultsProps) {
  const hasResults = attorneys.length > 0;
  const showLoadingState = isLoading;
  const showErrorState = error && !isLoading;
  const showNoResultsState = !isLoading && !error && !hasResults;
  const showResultsList = !isLoading && !error && hasResults;

  const handleClearFilters = () => {
    clearAllFilters();
  };

  return {
    hasResults,
    showLoadingState,
    showErrorState, 
    showNoResultsState,
    showResultsList,
    hasActiveFilters,
    handleClearFilters,
  };
}