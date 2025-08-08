"use client";

import { PRACTICE_AREAS, PracticeArea } from "@/constants";
import { useAttorneySearch } from "./hooks";
import { SEARCH_CONSTANTS } from "./constants";
import { AttorneyCard } from "../attorney-card";
import { Search, Filter, X, AlertCircle, Loader } from "lucide-react";

export function AttorneySearch() {
  const {
    attorneys,
    isLoading,
    error,
    filters,
    searchTerm,
    areFiltersVisible,
    activeFiltersCount,
    hasActiveFilters,
    setSearchTerm,
    updateFilter,
    clearAllFilters,
    toggleFiltersVisibility,
  } = useAttorneySearch();

  const renderSearchHeader = () => (
    <div className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Find Legal Counsel
        </h1>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={SEARCH_CONSTANTS.SEARCH_PLACEHOLDER}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleFiltersVisibility}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                areFiltersVisible
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}>
              <Filter className="w-4 h-4" />
              {areFiltersVisible
                ? SEARCH_CONSTANTS.ACTIONS.HIDE_FILTERS
                : SEARCH_CONSTANTS.ACTIONS.SHOW_FILTERS}
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors">
                {SEARCH_CONSTANTS.ACTIONS.CLEAR_ALL}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedFilters = () => {
    if (!areFiltersVisible) return null;

    return (
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Practice Areas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {SEARCH_CONSTANTS.FILTER_LABELS.PRACTICE_AREAS}
              </label>
              <select
                value={filters.practiceAreas?.[0] || "all"}
                onChange={(e) =>
                  updateFilter(
                    "practiceAreas",
                    e.target.value === "all"
                      ? undefined
                      : [e.target.value as PracticeArea]
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="all">All Practice Areas</option>
                {PRACTICE_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {SEARCH_CONSTANTS.FILTER_LABELS.LOCATION}
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder={SEARCH_CONSTANTS.PLACEHOLDERS.CITY}
                  value={filters.location?.city || ""}
                  onChange={(e) =>
                    updateFilter("location", {
                      ...filters.location,
                      city: e.target.value || undefined,
                      state: filters.location?.state || "",
                      country: filters.location?.country || "USA",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={filters.location?.state || ""}
                  onChange={(e) =>
                    updateFilter("location", {
                      ...filters.location,
                      state: e.target.value || undefined,
                      city: filters.location?.city || "",
                      country: filters.location?.country || "USA",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">
                    {SEARCH_CONSTANTS.PLACEHOLDERS.STATE}
                  </option>
                  {SEARCH_CONSTANTS.US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {SEARCH_CONSTANTS.FILTER_LABELS.EXPERIENCE}
              </label>
              <select
                value={filters.experienceLevel || "all"}
                onChange={(e) =>
                  updateFilter(
                    "experienceLevel",
                    e.target.value === "all" ? undefined : e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {SEARCH_CONSTANTS.EXPERIENCE_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Rate Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {SEARCH_CONSTANTS.FILTER_LABELS.HOURLY_RATE}
              </label>
              <select
                value={filters.rateRange || "all"}
                onChange={(e) =>
                  updateFilter(
                    "rateRange",
                    e.target.value === "all" ? undefined : e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {SEARCH_CONSTANTS.RATE_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {SEARCH_CONSTANTS.FILTER_LABELS.LANGUAGES}
              </label>
              <select
                value={filters.selectedLanguages?.[0] || "all"}
                onChange={(e) =>
                  updateFilter(
                    "selectedLanguages",
                    e.target.value === "all" ? undefined : [e.target.value]
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="all">All Languages</option>
                {SEARCH_CONSTANTS.COMMON_LANGUAGES.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {SEARCH_CONSTANTS.FILTER_LABELS.AVAILABILITY}
              </label>
              <select
                value={filters.availability || "all"}
                onChange={(e) =>
                  updateFilter(
                    "availability",
                    e.target.value === "all" ? undefined : e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {SEARCH_CONSTANTS.AVAILABILITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Client Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {SEARCH_CONSTANTS.FILTER_LABELS.RATING}
              </label>
              <select
                value={filters.rating || "all"}
                onChange={(e) =>
                  updateFilter(
                    "rating",
                    e.target.value === "all" ? undefined : e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {SEARCH_CONSTANTS.RATING_OPTIONS.map((rating) => (
                  <option key={rating.value} value={rating.value}>
                    {rating.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Consultation Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {SEARCH_CONSTANTS.FILTER_LABELS.CONSULTATION_TYPE}
              </label>
              <select
                value={filters.consultationType || "all"}
                onChange={(e) =>
                  updateFilter(
                    "consultationType",
                    e.target.value === "all" ? undefined : e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {SEARCH_CONSTANTS.CONSULTATION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Verified Only Checkbox */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isVerified || false}
                onChange={(e) =>
                  updateFilter("isVerified", e.target.checked || undefined)
                }
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Verified attorneys only
              </span>
            </label>
          </div>
        </div>
      </div>
    );
  };

  const renderResultsSection = () => (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader className="w-6 h-6 text-blue-500 animate-spin" />
            <span className="text-gray-600">Finding attorneys...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-medium">Error loading attorneys</p>
            <p className="text-red-600 text-sm mt-1">Please try again later</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              {SEARCH_CONSTANTS.RESULTS.SHOWING}{" "}
              <span className="font-semibold text-gray-900">
                {attorneys.length}
              </span>{" "}
              {SEARCH_CONSTANTS.RESULTS.OF}{" "}
              <span className="font-semibold text-gray-900">
                {attorneys.length}
              </span>{" "}
              {SEARCH_CONSTANTS.RESULTS.ATTORNEYS}
            </div>
          </div>

          {attorneys.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {SEARCH_CONSTANTS.RESULTS.NO_RESULTS}
                </h3>
                <p className="text-gray-500 mb-6">
                  {SEARCH_CONSTANTS.RESULTS.TRY_DIFFERENT}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    {SEARCH_CONSTANTS.ACTIONS.CLEAR_ALL}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {attorneys.map((attorney) => (
                <AttorneyCard key={attorney._id} attorney={attorney} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderSearchHeader()}
      {renderAdvancedFilters()}
      {renderResultsSection()}
    </div>
  );
}
