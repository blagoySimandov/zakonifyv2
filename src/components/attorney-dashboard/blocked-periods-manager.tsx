"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ATTORNEY_DASHBOARD_MESSAGES } from "@/messages";
import { 
  CalendarX,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Repeat,
  Briefcase,
  Plane,
  User,
  Building,
} from "lucide-react";

interface BlockedPeriodsManagerProps {
  attorneyId: Id<"attorneys">;
}

type BlockedPeriodType = "vacation" | "holiday" | "court-appearance" | "personal" | "conference" | "unavailable";

const BLOCKED_PERIOD_TYPES = [
  {
    value: "vacation" as BlockedPeriodType,
    label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.TYPES.VACATION,
    icon: Plane,
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "holiday" as BlockedPeriodType,
    label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.TYPES.HOLIDAY,
    icon: Calendar,
    color: "bg-green-100 text-green-700",
  },
  {
    value: "court-appearance" as BlockedPeriodType,
    label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.TYPES.COURT_APPEARANCE,
    icon: Building,
    color: "bg-red-100 text-red-700",
  },
  {
    value: "personal" as BlockedPeriodType,
    label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.TYPES.PERSONAL,
    icon: User,
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "conference" as BlockedPeriodType,
    label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.TYPES.CONFERENCE,
    icon: Briefcase,
    color: "bg-orange-100 text-orange-700",
  },
  {
    value: "unavailable" as BlockedPeriodType,
    label: ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.TYPES.UNAVAILABLE,
    icon: CalendarX,
    color: "bg-gray-100 text-gray-700",
  },
];

export function BlockedPeriodsManager({ attorneyId }: BlockedPeriodsManagerProps) {
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const [newPeriod, setNewPeriod] = useState({
    startDate: "",
    endDate: "",
    type: "vacation" as BlockedPeriodType,
    title: "",
    reason: "",
    isRecurring: false,
  });

  // Get blocked periods
  const blockedPeriods = useQuery(api.availability.getBlockedPeriods, { attorneyId }) || [];
  
  // Mutations
  const addBlockedPeriod = useMutation(api.availability.addBlockedPeriod);

  const handleAddPeriod = async () => {
    if (!newPeriod.startDate || !newPeriod.endDate || !newPeriod.title) {
      return;
    }

    try {
      const startTime = new Date(newPeriod.startDate).getTime();
      const endTime = new Date(newPeriod.endDate).getTime();

      await addBlockedPeriod({
        attorneyId,
        startTime,
        endTime,
        type: newPeriod.type,
        title: newPeriod.title,
        reason: newPeriod.reason || undefined,
        isRecurring: newPeriod.isRecurring,
      });

      // Reset form
      setNewPeriod({
        startDate: "",
        endDate: "",
        type: "vacation",
        title: "",
        reason: "",
        isRecurring: false,
      });
      setIsAddingPeriod(false);
    } catch (error) {
      console.error("Failed to add blocked period:", error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('bg-BG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
    }).format(new Date(timestamp));
  };

  const getTypeConfig = (type: BlockedPeriodType) => {
    return BLOCKED_PERIOD_TYPES.find(t => t.value === type) || BLOCKED_PERIOD_TYPES[0];
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.TITLE}
        </h3>
        <p className="text-gray-600 mb-6">
          {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.SUBTITLE}
        </p>
      </div>

      {/* Add Period Button/Form */}
      <div className="bg-gray-50 rounded-2xl p-6">
        {!isAddingPeriod ? (
          <button
            onClick={() => setIsAddingPeriod(true)}
            className="flex items-center space-x-3 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <div className="p-2 bg-primary-100 rounded-xl">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-medium">
              {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.ADD_BLOCKED_PERIOD}
            </span>
          </button>
        ) : (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">
              {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.ADD_BLOCKED_PERIOD}
            </h4>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.TITLE_FIELD}
              </label>
              <input
                type="text"
                value={newPeriod.title}
                onChange={(e) => setNewPeriod(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Заглавие на периода"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.START_DATE}
                </label>
                <input
                  type="date"
                  value={newPeriod.startDate}
                  onChange={(e) => setNewPeriod(prev => ({ ...prev, startDate: e.target.value }))}
                  min={today}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.END_DATE}
                </label>
                <input
                  type="date"
                  value={newPeriod.endDate}
                  onChange={(e) => setNewPeriod(prev => ({ ...prev, endDate: e.target.value }))}
                  min={newPeriod.startDate || today}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.TYPE}
              </label>
              <select
                value={newPeriod.type}
                onChange={(e) => setNewPeriod(prev => ({ ...prev, type: e.target.value as BlockedPeriodType }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
              >
                {BLOCKED_PERIOD_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.REASON} (опционално)
              </label>
              <textarea
                value={newPeriod.reason}
                onChange={(e) => setNewPeriod(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Допълнителна информация..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Recurring */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={newPeriod.isRecurring}
                  onChange={(e) => setNewPeriod(prev => ({ ...prev, isRecurring: e.target.checked }))}
                  className="w-5 h-5 text-primary-600 border-2 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.RECURRING}
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => {
                  setIsAddingPeriod(false);
                  setNewPeriod({
                    startDate: "",
                    endDate: "",
                    type: "vacation",
                    title: "",
                    reason: "",
                    isRecurring: false,
                  });
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors font-medium"
              >
                Отказ
              </button>
              
              <button
                onClick={handleAddPeriod}
                disabled={!newPeriod.title || !newPeriod.startDate || !newPeriod.endDate}
                className="px-6 py-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.SAVE_PERIOD}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Existing Blocked Periods */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">
          Активни блокирани периоди ({blockedPeriods.length})
        </h4>

        {blockedPeriods.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <CalendarX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">
              {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.BLOCKED_PERIODS.NO_BLOCKED_PERIODS}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {blockedPeriods.map((period: any) => {
              const typeConfig = getTypeConfig(period.type);
              const Icon = typeConfig.icon;
              
              return (
                <div key={period._id} className="bg-white rounded-2xl border-2 border-gray-100 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-2xl ${typeConfig.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h5 className="font-semibold text-gray-900">
                            {period.title}
                          </h5>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                            {typeConfig.label}
                          </span>
                          {period.isRecurring && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center space-x-1">
                              <Repeat className="w-3 h-3" />
                              <span>Повтарящ се</span>
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-1">
                          <span className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatDate(period.startTime)} - {formatDate(period.endTime)}
                            </span>
                          </span>
                        </div>
                        
                        {period.reason && (
                          <p className="text-sm text-gray-600 mt-2">
                            {period.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}