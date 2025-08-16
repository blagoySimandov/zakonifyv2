"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components";
import { Dropdown } from "@/components/ui/dropdown";
import { LANDING_PAGE_MESSAGES } from "./messages";

export default function Home() {
  const router = useRouter();
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchName, setSearchName] = useState("");

  const specialtyOptions = LANDING_PAGE_MESSAGES.SPECIALTIES.map(specialty => ({
    value: specialty,
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
    const url = queryString ? `/attorneys?${queryString}` : '/attorneys';
    
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
            <div className="bg-gray-100 rounded-2xl w-full max-w-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-center">
                {LANDING_PAGE_MESSAGES.ILLUSTRATION.ALT_TEXT}
                <br />
                <span className="text-sm">
                  {LANDING_PAGE_MESSAGES.ILLUSTRATION.PLACEHOLDER_TEXT}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 flex flex-col gap-8">
          {/* Subscription info box */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-primary-50 rounded-lg p-3 flex-shrink-0">
                <div className="w-8 h-8 bg-primary-500 rounded text-white text-xs font-bold flex items-center justify-center">
                  пΠ∩с
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {LANDING_PAGE_MESSAGES.SUBSCRIPTION.TITLE}{" "}
                  <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded">
                    {LANDING_PAGE_MESSAGES.SUBSCRIPTION.PLUS_BADGE}
                  </span>
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {LANDING_PAGE_MESSAGES.SUBSCRIPTION.DESCRIPTION}
                </p>
                <div className="flex gap-3">
                  <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg border-0 text-sm font-medium cursor-pointer">
                    {LANDING_PAGE_MESSAGES.SUBSCRIPTION.SUBSCRIBE_BUTTON}
                  </button>
                  <button className="bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50">
                    {LANDING_PAGE_MESSAGES.SUBSCRIPTION.LEARN_MORE_BUTTON}
                  </button>
                </div>
              </div>
            </div>
          </div>

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
