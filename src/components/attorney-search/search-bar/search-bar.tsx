"use client";

import { useSearchBar } from "./hooks";
import { SEARCH_BAR_MESSAGES } from "@/messages";

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
    <div className={className || "w-full"}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchInputChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-sm"
      />
    </div>
  );
}