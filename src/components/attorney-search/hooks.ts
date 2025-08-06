import { useState } from 'react'
import { AttorneySearchFilters } from '@/types'
import { trpc } from '@/utils'

interface ExtendedAttorneySearchFilters extends AttorneySearchFilters {
  experienceLevel?: string
  rateRange?: string
  availability?: string
  consultationType?: string
  rating?: string
  selectedLanguages?: string[]
}

interface UseAttorneySearchProps {
  initialFilters?: ExtendedAttorneySearchFilters
}

export function useAttorneySearch({ initialFilters = {} }: UseAttorneySearchProps = {}) {
  const [filters, setFilters] = useState<ExtendedAttorneySearchFilters>(initialFilters)
  const [searchTerm, setSearchTerm] = useState('')
  const [areFiltersVisible, setAreFiltersVisible] = useState(false)

  const { data: attorneys, isLoading, error } = trpc.attorneys.getAll.useQuery({
    ...filters,
    limit: 50,
  })

  const updateFilter = <K extends keyof ExtendedAttorneySearchFilters>(
    key: K,
    value: ExtendedAttorneySearchFilters[K]
  ) => {
    setFilters(previousFilters => ({
      ...previousFilters,
      [key]: value,
    }))
  }

  const clearAllFilters = () => {
    setFilters({})
    setSearchTerm('')
  }

  const toggleFiltersVisibility = () => {
    setAreFiltersVisible(previousState => !previousState)
  }

  const hideFilters = () => {
    setAreFiltersVisible(false)
  }

  const showFilters = () => {
    setAreFiltersVisible(true)
  }

  const getActiveFiltersCount = () => {
    const filterKeys = Object.keys(filters).filter(key => {
      const value = filters[key as keyof ExtendedAttorneySearchFilters]
      if (Array.isArray(value)) return value.length > 0
      return value && value !== 'all'
    })
    return filterKeys.length + (searchTerm.length > 0 ? 1 : 0)
  }

  const hasActiveFilters = getActiveFiltersCount() > 0

  const parseExperienceRange = (experienceLevel: string) => {
    if (!experienceLevel || experienceLevel === 'all') return undefined
    
    if (experienceLevel === '20+') {
      return { min: 20, max: undefined }
    }
    
    const [min, max] = experienceLevel.split('-').map(Number)
    return { min, max }
  }

  const parseRateRange = (rateRange: string) => {
    if (!rateRange || rateRange === 'all') return undefined
    
    if (rateRange === '501+') {
      return { min: 501, max: undefined }
    }
    
    const [min, max] = rateRange.split('-').map(Number)
    return { min, max }
  }

  return {
    attorneys: attorneys || [],
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
  }
}