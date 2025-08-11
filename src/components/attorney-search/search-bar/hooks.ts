import { useCallback } from "react";

interface UseSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function useSearchBar({ searchTerm, setSearchTerm }: UseSearchBarProps) {
  const handleSearchInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    [setSearchTerm]
  );

  return {
    searchTerm,
    handleSearchInputChange,
  };
}