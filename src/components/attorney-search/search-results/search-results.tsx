"use client";

import { Search, AlertCircle, Loader } from "lucide-react";
import { useSearchResults } from "./hooks";
import { SEARCH_RESULTS_CONSTANTS } from "./constants";
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
      <div className={SEARCH_RESULTS_CONSTANTS.LOADING_WRAPPER_CLASSES}>
        <div className={SEARCH_RESULTS_CONSTANTS.LOADING_CONTENT_CLASSES}>
          <Loader className={SEARCH_RESULTS_CONSTANTS.LOADING_ICON_CLASSES} />
          <span className={SEARCH_RESULTS_CONSTANTS.LOADING_TEXT_CLASSES}>
            {SEARCH_RESULTS_MESSAGES.LOADING}
          </span>
        </div>
      </div>
    );
  }

  if (showErrorState) {
    return (
      <div className={SEARCH_RESULTS_CONSTANTS.ERROR_WRAPPER_CLASSES}>
        <div className={SEARCH_RESULTS_CONSTANTS.ERROR_CONTAINER_CLASSES}>
          <AlertCircle
            className={SEARCH_RESULTS_CONSTANTS.ERROR_ICON_CLASSES}
          />
          <p className={SEARCH_RESULTS_CONSTANTS.ERROR_TITLE_CLASSES}>
            {SEARCH_RESULTS_MESSAGES.ERROR.TITLE}
          </p>
          <p className={SEARCH_RESULTS_CONSTANTS.ERROR_SUBTITLE_CLASSES}>
            {SEARCH_RESULTS_MESSAGES.ERROR.SUBTITLE}
          </p>
        </div>
      </div>
    );
  }

  if (showNoResultsState) {
    return (
      <div className={SEARCH_RESULTS_CONSTANTS.NO_RESULTS_WRAPPER_CLASSES}>
        <div className={SEARCH_RESULTS_CONSTANTS.NO_RESULTS_CONTAINER_CLASSES}>
          <Search
            className={SEARCH_RESULTS_CONSTANTS.NO_RESULTS_ICON_CLASSES}
          />
          <h3 className={SEARCH_RESULTS_CONSTANTS.NO_RESULTS_TITLE_CLASSES}>
            {SEARCH_RESULTS_MESSAGES.NO_RESULTS.TITLE}
          </h3>
          <p
            className={SEARCH_RESULTS_CONSTANTS.NO_RESULTS_DESCRIPTION_CLASSES}
          >
            {SEARCH_RESULTS_MESSAGES.NO_RESULTS.DESCRIPTION}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className={SEARCH_RESULTS_CONSTANTS.CLEAR_BUTTON_CLASSES}
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
      <div className={SEARCH_RESULTS_CONSTANTS.RESULTS_LIST_CLASSES}>
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
