"use client";

import { 
  Calendar, 
  Clock, 
  Settings, 
  User,
  LogOut
} from "lucide-react";
import { ATTORNEY_DASHBOARD_MESSAGES } from "@/messages";
import { useClerk } from "@clerk/nextjs";
import { useAttorneyProfileImage } from "@/components/attorney-profile-image/hooks";

interface AttorneyDashboardSidebarProps {
  activeSection: "availability" | "consultations" | "settings";
  onSectionChange: (section: "availability" | "consultations" | "settings") => void;
  attorney: any;
}

export function AttorneyDashboardSidebar({ 
  activeSection, 
  onSectionChange, 
  attorney 
}: AttorneyDashboardSidebarProps) {
  const { signOut } = useClerk();
  const profileImageUrl = useAttorneyProfileImage(attorney.profileImageStorageId);

  const menuItems = [
    {
      id: "availability", 
      label: ATTORNEY_DASHBOARD_MESSAGES.NAVIGATION.AVAILABILITY,
      icon: Clock,
    },
    {
      id: "consultations",
      label: ATTORNEY_DASHBOARD_MESSAGES.NAVIGATION.CONSULTATIONS, 
      icon: Calendar,
    },
    {
      id: "settings",
      label: ATTORNEY_DASHBOARD_MESSAGES.NAVIGATION.SETTINGS,
      icon: Settings,
    },
  ] as const;

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
{profileImageUrl ? (
            <img 
              src={profileImageUrl} 
              alt={attorney.fullName}
              className="w-12 h-12 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-primary-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {attorney.fullName}
            </h2>
            <p className="text-sm text-gray-500 truncate">
              {attorney.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-left transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700 border border-primary-200"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-primary-600" : "text-gray-400"}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>


      {/* Sign out */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Изход</span>
        </button>
      </div>
    </div>
  );
}