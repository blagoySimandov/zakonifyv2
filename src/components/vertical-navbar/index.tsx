"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils";
import {
  Settings,
  User,
  Calendar,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import Image from "next/image";
import type { Doc } from "../../../convex/_generated/dataModel";

interface VerticalNavbarProps {
  attorney: Doc<"attorneys"> | null;
  isLoading?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  currentPage?: string;
}

export function VerticalNavbar({
  attorney,
  isLoading,
  onCollapseChange,
  currentPage = "dashboard",
}: VerticalNavbarProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(currentPage);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const profileImageUrl = trpc.getStorageUrl.useQuery(
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    { storageId: attorney?.profileImageStorageId! }, //Safe due to enabled prop
    { enabled: !!attorney?.profileImageStorageId },
  );

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      href: "/attorneys/dashboard",
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      href: "/attorneys/calendar",
    },
    {
      id: "clients",
      label: "Clients",
      icon: Users,
      href: "/attorneys/clients",
    },
  ];

  const handleSettingsClick = () => {
    router.push("/attorneys/settings");
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log("Logout clicked");
  };

  const handleNavigation = (item: (typeof navigationItems)[0]) => {
    setActiveSection(item.id);
    router.push(item.href);
  };

  if (isLoading) {
    return (
      <div
        className={`${isCollapsed ? "w-16" : "w-64"} h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm fixed left-0 top-0 transition-all duration-300`}
      >
        <div className="p-6">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            {!isCollapsed && (
              <>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${isCollapsed ? "w-16" : "w-64"} h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm fixed left-0 top-0 transition-all duration-300`}
    >
      {/* Collapse Toggle Button */}
      <div className="p-3 border-b border-gray-100">
        <button
          onClick={() => {
            const newCollapsed = !isCollapsed;
            setIsCollapsed(newCollapsed);
            onCollapseChange?.(newCollapsed);
          }}
          className="w-full flex items-center justify-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Profile Section */}
      <div
        className={`${isCollapsed ? "p-3" : "p-6"} border-b border-gray-100`}
      >
        <div className="text-center">
          {profileImageUrl.data ? (
            <Image
              width={isCollapsed ? 100 : 160}
              height={isCollapsed ? 100 : 160}
              src={profileImageUrl.data}
              alt={attorney?.fullName || "Attorney Profile Image"}
              className={`${isCollapsed ? "w-10 h-10" : "w-16 h-16"} rounded-full mx-auto mb-4 object-cover border-2 border-blue-100 transition-all duration-300`}
            />
          ) : (
            <div
              className={`${isCollapsed ? "w-10 h-10" : "w-16 h-16"} bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-300`}
            >
              <User
                className={`${isCollapsed ? "w-5 h-5" : "w-8 h-8"} text-blue-600`}
              />
            </div>
          )}

          {!isCollapsed && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {attorney?.fullName || "Attorney Name"}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                {attorney?.email || "attorney@example.com"}
              </p>

              {attorney?.isVerified && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Verified
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-6">
        <nav className="px-3">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3"} px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"} ${isCollapsed ? "" : "flex-shrink-0"}`}
                    />
                    {!isCollapsed && item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Attorney Info - Hidden when collapsed */}
      {attorney && !isCollapsed && (
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="text-center space-y-2">
            <div className="text-xs text-gray-500">
              {attorney.yearsOfExperience} years experience
            </div>
            <div className="text-xs text-gray-500">
              ${attorney.hourlyRate}/hour
            </div>
            {attorney.location && (
              <div className="text-xs text-gray-500">
                {attorney.location.city}, {attorney.location.state}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Actions - Hidden when collapsed */}
      {!isCollapsed && (
        <div className="p-3 border-t border-gray-100">
          <div className="space-y-2">
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-400" />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
