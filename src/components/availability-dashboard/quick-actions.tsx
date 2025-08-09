"use client";

import { Id } from "../../../convex/_generated/dataModel";
import { DASHBOARD_CONSTANTS } from "./constants";
import {
  Calendar,
  Settings,
  BarChart3,
  AlertTriangle,
  Clock,
  Zap,
} from "lucide-react";

interface QuickActionsProps {
  attorneyId: Id<"attorneys">;
  onScheduleTimeOff: () => void;
  onUpdateSettings: () => void;
  onViewAnalytics: () => void;
}

export function QuickActions({
  onScheduleTimeOff,
  onUpdateSettings,
  onViewAnalytics,
}: QuickActionsProps) {
  const quickActions = [
    {
      id: "time-off",
      title: DASHBOARD_CONSTANTS.QUICK_ACTIONS.SCHEDULE_TIME_OFF.TITLE,
      description:
        DASHBOARD_CONSTANTS.QUICK_ACTIONS.SCHEDULE_TIME_OFF.DESCRIPTION,
      icon: Calendar,
      onClick: onScheduleTimeOff,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      hoverColor: "hover:bg-blue-100",
    },
    {
      id: "settings",
      title: DASHBOARD_CONSTANTS.QUICK_ACTIONS.UPDATE_SETTINGS.TITLE,
      description:
        DASHBOARD_CONSTANTS.QUICK_ACTIONS.UPDATE_SETTINGS.DESCRIPTION,
      icon: Settings,
      onClick: onUpdateSettings,
      color: "bg-green-50 text-green-600 border-green-200",
      hoverColor: "hover:bg-green-100",
    },
    {
      id: "analytics",
      title: DASHBOARD_CONSTANTS.QUICK_ACTIONS.VIEW_ANALYTICS.TITLE,
      description: DASHBOARD_CONSTANTS.QUICK_ACTIONS.VIEW_ANALYTICS.DESCRIPTION,
      icon: BarChart3,
      onClick: onViewAnalytics,
      color: "bg-purple-50 text-purple-600 border-purple-200",
      hoverColor: "hover:bg-purple-100",
    },
    {
      id: "emergency",
      title: DASHBOARD_CONSTANTS.QUICK_ACTIONS.EMERGENCY_SLOTS.TITLE,
      description:
        DASHBOARD_CONSTANTS.QUICK_ACTIONS.EMERGENCY_SLOTS.DESCRIPTION,
      icon: Zap,
      onClick: () => {
        /* TODO: Handle emergency slots */
      },
      color: "bg-orange-50 text-orange-600 border-orange-200",
      hoverColor: "hover:bg-orange-100",
    },
  ];

  const renderAction = (action: (typeof quickActions)[0]) => {
    const IconComponent = action.icon;

    return (
      <button
        key={action.id}
        onClick={action.onClick}
        className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${action.color} ${action.hoverColor} hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white/60">
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {action.description}
            </p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          {DASHBOARD_CONSTANTS.QUICK_ACTIONS.TITLE}
        </h3>
      </div>

      <div className="space-y-3">{quickActions.map(renderAction)}</div>

      {/* Additional helpful actions */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <Clock className="w-4 h-4" />
            Business Hours
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <AlertTriangle className="w-4 h-4" />
            Notifications
          </button>
        </div>
      </div>
    </div>
  );
}

