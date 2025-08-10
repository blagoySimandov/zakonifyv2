"use client";

import { useAttorneySearch } from "./hooks";
import { SearchHeader } from "./search-header";
import { SearchResults } from "./search-results";
import { SearchSidebar } from "./search-sidebar";

export function AttorneySearch() {
  const {
    attorneys,
    isLoading,
    error,
    searchTerm,
    hasActiveFilters,
    setSearchTerm,
    clearAllFilters,
  } = useAttorneySearch();

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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
          <SearchSidebar />
        </div>
      </div>
    </div>
  );
}
