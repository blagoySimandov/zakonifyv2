interface UseSearchHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function useSearchHeader({ searchTerm, setSearchTerm }: UseSearchHeaderProps) {
  const handleSearchSubmit = () => {
    // Search logic will be handled by parent component through searchTerm
  };

  return {
    handleSearchSubmit,
  };
}