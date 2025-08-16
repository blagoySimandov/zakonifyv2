"use client";

import { useAttorneySearch } from "./hooks";
import { SearchHeader } from "./search-header";
import { SearchResults } from "./search-results";
import { SearchSidebar } from "./search-sidebar";
import { type PracticeArea } from "@/constants";
import { type AttorneySearchFilters } from "@/types";

interface AttorneySearchProps {
  initialFilters?: AttorneySearchFilters & { practiceArea?: PracticeArea };
  initialSearchTerm?: string;
}

export function AttorneySearch({ 
  initialFilters = {},
  initialSearchTerm = ""
}: AttorneySearchProps = {}) {
  const {
    attorneys,
    isLoading,
    error,
    searchTerm,
    hasActiveFilters,
    setSearchTerm,
    clearAllFilters,
    updateFilter,
    filters,
  } = useAttorneySearch({
    initialFilters,
    initialSearchTerm,
  });

  const handlePracticeAreaChange = (practiceArea: PracticeArea | "") => {
    updateFilter('practiceArea', practiceArea || undefined);
  };

  return (
    <div className="bg-gray-50">
      <SearchHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        onPracticeAreaChange={handlePracticeAreaChange}
        selectedPracticeArea={filters.practiceArea || ""}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          <div className="flex-1">
            <SearchResults
              attorneys={attorneys}
              isLoading={isLoading}
              error={!!error}
              hasActiveFilters={hasActiveFilters}
              clearAllFilters={clearAllFilters}
            />
          </div>
          <SearchSidebar 
            onPracticeAreaSelect={handlePracticeAreaChange}
            selectedPracticeArea={filters.practiceArea || ""}
          />
        </div>
      </div>
    </div>
  );
}
