"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components";
import { Dropdown } from "@/components/ui/dropdown";
import { LANDING_PAGE_MESSAGES } from "@/messages";
import { PRACTICE_AREA_LABEL_TO_ENUM } from "@/constants";

export default function Home() {
  const router = useRouter();
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchName, setSearchName] = useState("");

  const specialtyOptions = LANDING_PAGE_MESSAGES.SPECIALTIES.map(specialty => ({
    value: PRACTICE_AREA_LABEL_TO_ENUM[specialty] || specialty,
    label: specialty
  }));

  const locationOptions = LANDING_PAGE_MESSAGES.CITIES.map(city => ({
    value: city,
    label: city
  }));

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (selectedSpecialty) {
      params.set('practiceArea', selectedSpecialty);
    }
    
    if (selectedLocation) {
      params.set('location', selectedLocation);
    }
    
    if (searchName.trim()) {
      params.set('search', searchName.trim());
    }
    
    const queryString = params.toString();
    const url = queryString ? `/search?${queryString}` : '/search';
    
    router.push(url);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-wrap gap-12 items-center">
          {/* Left Column - Content and Search */}
          <div className="flex flex-col gap-8 flex-1 min-w-[300px] basis-[400px]">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {LANDING_PAGE_MESSAGES.HERO.TITLE}
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                {LANDING_PAGE_MESSAGES.HERO.SUBTITLE}
              </p>
            </div>

            {/* Search Form */}
            <div className="flex flex-col gap-4">
              <Dropdown
                options={specialtyOptions}
                value={selectedSpecialty}
                placeholder={LANDING_PAGE_MESSAGES.SEARCH_FORM.SPECIALTY_PLACEHOLDER}
                onChange={setSelectedSpecialty}
                className="w-full"
                clearable
              />
              
              <Dropdown
                options={locationOptions}
                value={selectedLocation}
                placeholder={LANDING_PAGE_MESSAGES.SEARCH_FORM.LOCATION_PLACEHOLDER}
                onChange={setSelectedLocation}
                className="w-full"
                clearable
              />
              
              <input
                type="text"
                placeholder={LANDING_PAGE_MESSAGES.SEARCH_FORM.NAME_PLACEHOLDER}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              
              <button 
                onClick={handleSearch}
                className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-xl border-0 text-base font-semibold cursor-pointer transition-colors"
              >
                {LANDING_PAGE_MESSAGES.SEARCH_FORM.SEARCH_BUTTON}
              </button>
            </div>

            <p className="text-primary-500 text-sm">
              {LANDING_PAGE_MESSAGES.SEARCH_FORM.OFFICE_LINK}
            </p>
          </div>

          {/* Right Column - Illustration */}
          <div className="flex justify-center flex-1 min-w-[300px] basis-[400px]">
            <div className="w-full max-w-lg h-96 flex items-center justify-center">
              <Image
                src="/images/at.png"
                alt={LANDING_PAGE_MESSAGES.ILLUSTRATION.ALT_TEXT}
                width={500}
                height={400}
                className="rounded-2xl object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16">
          {/* About section */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              {LANDING_PAGE_MESSAGES.ABOUT.TITLE}
            </h2>
            <p className="text-gray-600 text-center max-w-4xl mx-auto">
              {LANDING_PAGE_MESSAGES.ABOUT.DESCRIPTION}{" "}
              <Link href="#" className="text-primary-500 hover:underline">
                {LANDING_PAGE_MESSAGES.ABOUT.LEARN_MORE_LINK}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
