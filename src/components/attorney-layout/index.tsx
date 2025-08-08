"use client";

import { useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { trpc } from "@/utils";
import { VerticalNavbar, ChatFab } from "@/components";
import type { Doc } from "../../../convex/_generated/dataModel";
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
  showChat = true 
}: AttorneyLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // Determine current page from pathname
  const getCurrentPage = () => {
    if (pathname?.includes('/dashboard')) return 'dashboard';
    if (pathname?.includes('/calendar')) return 'calendar';
    if (pathname?.includes('/clients')) return 'clients';
    if (pathname?.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  // Fetch attorney data
  const attorneyQuery = trpc.attorneys.getById.useQuery({ id: attorneyId });
  const attorney = attorneyQuery.data as Doc<"attorneys"> | null;
  const isAttorneyLoaded = !!attorneyQuery.data || attorneyQuery.isFetched;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vertical Navbar */}
      <VerticalNavbar 
        attorney={attorney} 
        isLoading={!isAttorneyLoaded}
        onCollapseChange={setIsSidebarCollapsed}
        currentPage={getCurrentPage()}
      />

      {/* Header - Full width with dynamic left margin */}
      <div className={`${isSidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-bold text-gray-800">
            {title}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isSidebarCollapsed ? 'ml-16' : 'ml-64'} h-screen flex flex-col transition-all duration-300`}>
        {children}
      </div>

      {/* Floating Action Button for Chat */}
      {showChat && <ChatFab attorneyId={attorneyId} />}
    </div>
  );
}