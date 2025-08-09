"use client";

import { useAttorneySearch } from "./hooks";
import { SEARCH_CONSTANTS } from "./constants";
import { AttorneyCard } from "../attorney-card";
import { Search, AlertCircle, Loader } from "lucide-react";

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

  const renderSearchHeader = () => (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-gray-900">zakonify.bg</div>
            <nav className="hidden md:flex space-x-6">
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Online Consultations
              </button>
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Practice Areas
              </button>
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Insurance
              </button>
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Work with Children
              </button>
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Filters
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <AlertCircle className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              B
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="pb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-3">
                <select className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Practice Areas</option>
                  {PRACTICE_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>

                <select className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Select Location</option>
                  {SEARCH_CONSTANTS.US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search by attorney name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-500"
                  />
                </div>

                <button className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResultsSection = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-8">
        {/* Left Column - Attorney Cards */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader className="w-6 h-6 text-teal-500 animate-spin" />
                <span className="text-gray-600">
                  {SEARCH_CONSTANTS.LOADING_TEXT}
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-700 font-medium">
                  {SEARCH_CONSTANTS.ERROR_TITLE}
                </p>
                <p className="text-red-600 text-sm mt-1">
                  {SEARCH_CONSTANTS.ERROR_SUBTITLE}
                </p>
              </div>
            </div>
          ) : (
            <>
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
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                      >
                        {SEARCH_CONSTANTS.ACTIONS.CLEAR_ALL}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {attorneys.map((attorney) => (
                    <AttorneyCard key={attorney._id} attorney={attorney} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="w-80 hidden lg:block">
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>
                Moving the map can help you find attorneys in the region
              </span>
            </div>
          </div>

          {/* Recent Searches or Related Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Popular Practice Areas
            </h3>
            <div className="space-y-2">
              {PRACTICE_AREAS.slice(0, 5).map((area) => (
                <button
                  key={area}
                  className="block w-full text-left text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 py-1 rounded transition-colors"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderSearchHeader()}
      {renderResultsSection()}
    </div>
  );
}
