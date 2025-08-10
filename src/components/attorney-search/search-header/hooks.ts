interface UseSearchHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function useSearchHeader({ searchTerm, setSearchTerm }: UseSearchHeaderProps) {
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    // Search logic will be handled by parent component through searchTerm
  };

  return {
    searchTerm,
    handleSearchInputChange,
    handleSearchSubmit,
  };
}