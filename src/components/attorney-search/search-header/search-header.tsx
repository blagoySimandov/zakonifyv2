"use client";

import { useSearchHeader } from "./hooks";
import { SEARCH_HEADER_MESSAGES } from "./messages";
import { PracticeAreaSelector } from "../practice-area-selector";
import { LocationSelector } from "../location-selector";
import { type PracticeArea } from "@/constants";

interface SearchHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onPracticeAreaChange?: (practiceArea: PracticeArea | "") => void;
  selectedPracticeArea?: PracticeArea | "";
}

export function SearchHeader({ 
  searchTerm, 
  setSearchTerm, 
  onPracticeAreaChange,
  selectedPracticeArea 
}: SearchHeaderProps) {
  const { handleSearchInputChange, handleSearchSubmit } = useSearchHeader({
    searchTerm,
    setSearchTerm,
  });

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="flex gap-3">
              <PracticeAreaSelector 
                onPracticeAreaChange={onPracticeAreaChange}
                value={selectedPracticeArea}
              />
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
  );
}