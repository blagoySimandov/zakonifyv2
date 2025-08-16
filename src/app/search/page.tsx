"use client";

import { AttorneySearch, Navbar } from "@/components";
import { useSearchParams } from "next/navigation";
import { type PracticeArea } from "@/constants";

export default function SearchPage() {
  const searchParams = useSearchParams();
  
  const initialFilters = {
    practiceArea: searchParams.get('practiceArea') as PracticeArea | undefined,
    location: searchParams.get('location') ? { city: searchParams.get('location')! } : undefined,
  };
  
  const initialSearchTerm = searchParams.get('search') || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AttorneySearch 
        initialFilters={initialFilters}
        initialSearchTerm={initialSearchTerm}
      />
    </div>
  );
}