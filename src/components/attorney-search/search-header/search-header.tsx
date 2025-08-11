"use client";

import { useSearchHeader } from "./hooks";
import { SEARCH_HEADER_MESSAGES } from "./messages";
import { PracticeAreaSelector } from "../practice-area-selector";
import { LocationSelector } from "../location-selector";
import { SearchBar } from "../search-bar";
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
  const { handleSearchSubmit } = useSearchHeader({
    searchTerm,
    setSearchTerm,
  });

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-56">
            <PracticeAreaSelector 
              onPracticeAreaChange={onPracticeAreaChange}
              value={selectedPracticeArea}
            />
          </div>
          
          <div className="flex-shrink-0 w-44">
            <LocationSelector />
          </div>
          
          <div className="flex-1 min-w-0">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder={SEARCH_HEADER_MESSAGES.SEARCH.NAME_PLACEHOLDER}
            />
          </div>

          <button 
            onClick={handleSearchSubmit}
            className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-medium flex-shrink-0 shadow-sm"
          >
            {SEARCH_HEADER_MESSAGES.SEARCH.SEARCH_BUTTON}
          </button>
        </div>
      </div>
    </div>
  );
}