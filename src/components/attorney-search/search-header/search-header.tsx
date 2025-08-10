"use client";

import { AlertCircle } from "lucide-react";
import { useSearchHeader } from "./hooks";
import { SEARCH_HEADER_CONSTANTS } from "./constants";
import { SEARCH_HEADER_MESSAGES } from "./messages";
import { PracticeAreaSelector } from "../practice-area-selector";
import { LocationSelector } from "../location-selector";

interface SearchHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function SearchHeader({ searchTerm, setSearchTerm }: SearchHeaderProps) {
  const { handleSearchInputChange, handleSearchSubmit } = useSearchHeader({
    searchTerm,
    setSearchTerm,
  });

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-gray-900">
              {SEARCH_HEADER_MESSAGES.LOGO}
            </div>
            <nav className="hidden md:flex space-x-6">
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                {SEARCH_HEADER_MESSAGES.NAVIGATION.ONLINE_CONSULTATIONS}
              </button>
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                {SEARCH_HEADER_MESSAGES.NAVIGATION.PRACTICE_AREAS}
              </button>
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                {SEARCH_HEADER_MESSAGES.NAVIGATION.INSURANCE}
              </button>
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                {SEARCH_HEADER_MESSAGES.NAVIGATION.WORK_WITH_CHILDREN}
              </button>
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                {SEARCH_HEADER_MESSAGES.NAVIGATION.FILTERS}
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <AlertCircle className="w-5 h-5" />
            </button>
            <div className={`w-8 h-8 ${SEARCH_HEADER_CONSTANTS.USER_AVATAR_COLOR} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
              {SEARCH_HEADER_CONSTANTS.AVATAR_INITIAL}
            </div>
          </div>
        </div>

        <div className="pb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-3">
                <PracticeAreaSelector />
                <LocationSelector />
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={SEARCH_HEADER_MESSAGES.SEARCH.NAME_PLACEHOLDER}
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-500"
                  />
                </div>

                <button 
                  onClick={handleSearchSubmit}
                  className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
                >
                  {SEARCH_HEADER_MESSAGES.SEARCH.SEARCH_BUTTON}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}