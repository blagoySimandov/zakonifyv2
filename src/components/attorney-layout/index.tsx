"use client";

import { useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { VerticalNavbar, ChatFab } from "@/components";
import { MOCK_ATTORNEY_ID } from "@/constants";

interface AttorneyLayoutProps {
  children: ReactNode;
  title: string;
  attorneyId?: string;
  showChat?: boolean;
}

export function AttorneyLayout({
  children,
  title,
  attorneyId = MOCK_ATTORNEY_ID,
  showChat = true,
}: AttorneyLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // Determine current page from pathname
  const getCurrentPage = () => {
    if (pathname?.includes("/dashboard")) return "dashboard";
    if (pathname?.includes("/calendar")) return "calendar";
    if (pathname?.includes("/clients")) return "clients";
    if (pathname?.includes("/settings")) return "settings";
    return "dashboard";
  };

  // Fetch attorney data
  const attorney = useQuery(api.attorneys.getById, {
    id: attorneyId as Id<"attorneys">,
  });
  const isAttorneyLoaded = attorney !== undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vertical Navbar */}
      <VerticalNavbar
        attorney={attorney || null}
        isLoading={!isAttorneyLoaded}
        onCollapseChange={setIsSidebarCollapsed}
        currentPage={getCurrentPage()}
      />

      {/* Header - Full width with dynamic left margin */}
      <div
        className={`${isSidebarCollapsed ? "ml-16" : "ml-64"} transition-all duration-300`}
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`${isSidebarCollapsed ? "ml-16" : "ml-64"} h-screen flex flex-col transition-all duration-300`}
      >
        {children}
      </div>

      {/* Floating Action Button for Chat */}
      {showChat && <ChatFab attorneyId={attorneyId} />}
    </div>
  );
}
