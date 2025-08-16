"use client";

import { Search, AlertCircle, Loader } from "lucide-react";
import { useSearchResults } from "./hooks";
import { SEARCH_RESULTS_MESSAGES } from "./messages";
import { AttorneyCard } from "../../attorney-card";
import { Attorney } from "../../../types/attorney";

interface SearchResultsProps {
  attorneys: Attorney[];
  isLoading: boolean;
  error: boolean;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
}

export function SearchResults({
  attorneys,
  isLoading,
  error,
  hasActiveFilters,
  clearAllFilters,
}: SearchResultsProps) {
  const {
    showLoadingState,
    showErrorState,
    showNoResultsState,
    showResultsList,
    handleClearFilters,
  } = useSearchResults({
    attorneys,
    isLoading,
    error,
    hasActiveFilters,
    clearAllFilters,
  });

  if (showLoadingState) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 text-primary-500 animate-spin" />
          <span className="text-gray-600">
            {SEARCH_RESULTS_MESSAGES.LOADING}
          </span>
        </div>
      </div>
    );
  }

  if (showErrorState) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <AlertCircle
            className="w-12 h-12 text-red-500 mx-auto mb-4"
          />
          <p className="text-red-700 font-medium">
            {SEARCH_RESULTS_MESSAGES.ERROR.TITLE}
          </p>
          <p className="text-red-600 text-sm mt-1">
            {SEARCH_RESULTS_MESSAGES.ERROR.SUBTITLE}
          </p>
        </div>
      </div>
    );
  }

  if (showNoResultsState) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <Search
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {SEARCH_RESULTS_MESSAGES.NO_RESULTS.TITLE}
          </h3>
          <p
            className="text-gray-500 mb-6"
          >
            {SEARCH_RESULTS_MESSAGES.NO_RESULTS.DESCRIPTION}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {SEARCH_RESULTS_MESSAGES.NO_RESULTS.CLEAR_FILTERS}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (showResultsList) {
    return (
      <div className="space-y-4">
        {attorneys.map((attorney) => (
          <AttorneyCard
            key={attorney._id}
            attorney={attorney}
            attorneyProfileHref={`/attorneys/${attorney._id}`}
          />
        ))}
      </div>
    );
  }

  return null;
}
