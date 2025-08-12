import { useState, useMemo } from "react";
import { AttorneySearchFilters } from "@/types";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { type PracticeArea } from "@/constants";
import Fuse from "fuse.js";

interface ExtendedAttorneySearchFilters extends AttorneySearchFilters {
  practiceArea?: PracticeArea;
  experienceLevel?: string;
  rateRange?: string;
  availability?: string;
  consultationType?: string;
  rating?: string;
  selectedLanguages?: string[];
}

interface UseAttorneySearchProps {
  initialFilters?: ExtendedAttorneySearchFilters;
}

export function useAttorneySearch({
  initialFilters = {},
}: UseAttorneySearchProps = {}) {
  const [filters, setFilters] =
    useState<ExtendedAttorneySearchFilters>(initialFilters);
  const [searchTerm, setSearchTerm] = useState("");
  const [areFiltersVisible, setAreFiltersVisible] = useState(false);

  const allAttorneys = useQuery(api.attorneys.getAll, { limit: 1000 });
  const isLoading = allAttorneys === undefined;
  const error = null;

  const fuseOptions = {
    keys: ['fullName'],
    threshold: 0.3,
    distance: 100,
    includeScore: true,
    minMatchCharLength: 1,
  };

  const fuse = useMemo(() => {
    if (!allAttorneys) return null;
    return new Fuse(allAttorneys, fuseOptions);
  }, [allAttorneys]);

  const attorneys = useMemo(() => {
    if (!allAttorneys) return [];

    let filteredAttorneys = allAttorneys;

    if (searchTerm.trim() && fuse) {
      const searchResults = fuse.search(searchTerm.trim());
      filteredAttorneys = searchResults.map(result => result.item);
    }

    if (filters.practiceArea) {
      filteredAttorneys = filteredAttorneys.filter(attorney =>
        attorney.practiceAreas.includes(filters.practiceArea!)
      );
    }

    if (filters.location?.city) {
      filteredAttorneys = filteredAttorneys.filter(attorney =>
        attorney.location.city === filters.location!.city
      );
    }

    if (filters.isVerified !== undefined) {
      filteredAttorneys = filteredAttorneys.filter(attorney =>
        attorney.isVerified === filters.isVerified
      );
    }

    return filteredAttorneys.slice(0, 50);
  }, [allAttorneys, searchTerm, filters, fuse]);

  const updateFilter = <K extends keyof ExtendedAttorneySearchFilters>(
    key: K,
    value: ExtendedAttorneySearchFilters[K],
  ) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const toggleFiltersVisibility = () => {
    setAreFiltersVisible((previousState) => !previousState);
  };

  const hideFilters = () => {
    setAreFiltersVisible(false);
  };

  const showFilters = () => {
    setAreFiltersVisible(true);
  };

  const getActiveFiltersCount = () => {
    const filterKeys = Object.keys(filters).filter((key) => {
      const value = filters[key as keyof ExtendedAttorneySearchFilters];
      if (Array.isArray(value)) return value.length > 0;
      return value && value !== "all";
    });
    return filterKeys.length + (searchTerm.length > 0 ? 1 : 0);
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  const parseExperienceRange = (experienceLevel: string) => {
    if (!experienceLevel || experienceLevel === "all") return undefined;

    if (experienceLevel === "20+") {
      return { min: 20, max: undefined };
    }

    const [min, max] = experienceLevel.split("-").map(Number);
    return { min, max };
  };

  const parseRateRange = (rateRange: string) => {
    if (!rateRange || rateRange === "all") return undefined;

    if (rateRange === "501+") {
      return { min: 501, max: undefined };
    }

    const [min, max] = rateRange.split("-").map(Number);
    return { min, max };
  };

  return {
    attorneys,
    isLoading,
    error,
    filters,
    searchTerm,
    areFiltersVisible,
    activeFiltersCount: getActiveFiltersCount(),
    hasActiveFilters,
    setSearchTerm,
    updateFilter,
    clearAllFilters,
    toggleFiltersVisibility,
    hideFilters,
    showFilters,
    parseExperienceRange,
    parseRateRange,
  };
}
