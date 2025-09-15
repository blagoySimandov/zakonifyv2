"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ATTORNEY_DASHBOARD_MESSAGES } from "@/messages";
import {
  Calendar,
  Settings,
  User,
  Shield,
} from "lucide-react";
import { AttorneyDashboardSidebar } from "@/components/attorney-dashboard";
import { AvailabilityProfileManager } from "@/components/attorney-dashboard";
import { DashboardStats } from "@/components/attorney-dashboard";
import { ConsultationCalendar } from "@/components/attorney-dashboard";

type DashboardSection = "availability" | "consultations" | "settings";

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p className="text-gray-600">Зареждане...</p>
    </div>
  </div>
);

const UnauthorizedAccess = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md mx-auto text-center">
      <div className="mb-6">
        <Shield className="mx-auto h-16 w-16 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        {ATTORNEY_DASHBOARD_MESSAGES.ERRORS.ACCESS_DENIED}
      </h1>
      <p className="text-gray-600 mb-8">
        {ATTORNEY_DASHBOARD_MESSAGES.ERRORS.AUTHENTICATION_ERROR}
      </p>
      <button
        onClick={() => window.location.href = "/login"}
        className="px-6 py-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-colors font-medium"
      >
        Влез в профила си
      </button>
    </div>
  </div>
);

const NoAttorneyProfile = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md mx-auto text-center">
      <div className="mb-6">
        <User className="mx-auto h-16 w-16 text-amber-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Няма създаден профил на адвокат
      </h1>
      <p className="text-gray-600 mb-8">
        За да достъпите таблото, трябва първо да създадете профил на адвокат.
      </p>
      <button
        onClick={() => window.location.href = "/register"}
        className="px-6 py-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-colors font-medium"
      >
        Създай профил на адвокат
      </button>
    </div>
  </div>
);

export default function AttorneyDashboard() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const [activeSection, setActiveSection] = useState<DashboardSection>("availability");
  
  // Check if user is attorney
  const isAttorney = useQuery(api.attorneys.isCurrentUserAttorney, {});
  const attorney = useQuery(api.attorneys.getByClerkEmail, {});
  const availabilityProfile = useQuery(
    api.availability.getAvailabilityProfile,
    attorney?._id ? { attorneyId: attorney._id } : "skip"
  );
  
  const consultations = useQuery(
    api.consultations.getByAttorneyId,
    attorney?._id ? { 
      attorneyId: attorney._id,
      status: undefined 
    } : "skip"
  ) || [];

  // Loading state
  if (!isClerkLoaded || isAttorney === undefined || attorney === undefined) {
    return <LoadingSpinner />;
  }

  // Authentication check
  if (!user) {
    return <UnauthorizedAccess />;
  }

  // Check if user is an attorney
  if (isAttorney === false || !attorney) {
    return <NoAttorneyProfile />;
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case "availability":
        return (
          <div className="flex-1 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.TITLE}
              </h1>
              <p className="text-gray-600">
                {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.SUBTITLE}
              </p>
            </div>
            <AvailabilityProfileManager 
              attorney={attorney} 
              availabilityProfile={availabilityProfile} 
            />
          </div>
        );
      
      case "consultations":
        return (
          <div className="flex-1 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {ATTORNEY_DASHBOARD_MESSAGES.NAVIGATION.CONSULTATIONS}
              </h1>
              <p className="text-gray-600">
                Управлявайте вашите консултации и срещи
              </p>
            </div>
            <ConsultationCalendar attorney={attorney} />
          </div>
        );
      
      case "settings":
        return (
          <div className="flex-1 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {ATTORNEY_DASHBOARD_MESSAGES.NAVIGATION.SETTINGS}
              </h1>
              <p className="text-gray-600">
                Конфигурирайте настройките на вашия профил
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 text-center">
              <Settings className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Настройки на профила
              </h3>
              <p className="text-gray-600 mb-6">
                Тази функция ще бъде добавена скоро
              </p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex-1 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.TITLE}
              </h1>
              <p className="text-gray-600">
                {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.SUBTITLE}
              </p>
            </div>
            <AvailabilityProfileManager 
              attorney={attorney} 
              availabilityProfile={availabilityProfile} 
            />
          </div>
        );
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AttorneyDashboardSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        attorney={attorney}
      />
      {renderMainContent()}
    </div>
  );
}
