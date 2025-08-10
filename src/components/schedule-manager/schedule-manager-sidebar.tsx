import { Globe } from "lucide-react";
import { TabButton } from "./tab-button";
import { Tab, TabId } from "./types";
import { TABS } from "./constants";

interface ScheduleManagerSidebarProps {
  activeTab: TabId;
  timeZone: string | null;
  onTabChange: (tabId: TabId) => void;
}

export function ScheduleManagerSidebar({
  activeTab,
  timeZone,
  onTabChange,
}: ScheduleManagerSidebarProps) {
  const renderTabButton = (tab: Tab) => (
    <TabButton
      key={tab.id}
      tab={tab}
      isActive={activeTab === tab.id}
      setActiveTab={onTabChange}
    />
  );

  return (
    <div className="w-64 p-4 border-r border-gray-200 bg-gray-50">
      <div className="space-y-2">{TABS.map(renderTabButton)}</div>

      {/* Time Zone Display */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 text-blue-700 text-sm font-medium mb-1">
          <Globe className="w-4 h-4" />
          Current Time Zone
        </div>
        <p className="text-sm text-blue-600">
          {timeZone?.replace("_", " ") || "Not set"}
        </p>
      </div>
    </div>
  );
}
