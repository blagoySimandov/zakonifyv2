"use client";

import { useSearchBar } from "./hooks";
import { SEARCH_BAR_CONSTANTS } from "./constants";
import { SEARCH_BAR_MESSAGES } from "./messages";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  searchTerm,
  setSearchTerm,
  placeholder = SEARCH_BAR_MESSAGES.NAME_PLACEHOLDER,
  className,
}: SearchBarProps) {
  const { handleSearchInputChange } = useSearchBar({
    searchTerm,
    setSearchTerm,
  });

  return (
    <div className={className || SEARCH_BAR_CONSTANTS.CONTAINER_CLASSES}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchInputChange}
        className={SEARCH_BAR_CONSTANTS.INPUT_CLASSES}
      />
    </div>
  );
}