import { TABS } from "./constants";
import { TabId } from "./types";

type TabButtonProps = {
  tab: (typeof TABS)[number];
  isActive: boolean;
  setActiveTab: (id: TabId) => void;
};

export function TabButton({ tab, isActive, setActiveTab }: TabButtonProps) {
  return (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex items-center gap-3 w-full p-3 text-left rounded-lg transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-700 border border-blue-200"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      <tab.icon className="w-5 h-5" />
      <div>
        <div className="font-medium">{tab.label}</div>
        <div className="text-xs text-gray-500">{tab.description}</div>
      </div>
    </button>
  );
}
