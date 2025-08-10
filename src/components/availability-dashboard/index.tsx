"use client";

import { Id } from "../../../convex/_generated/dataModel";
import { useAvailabilityDashboard } from "./hooks";
import { UpcomingConsultations } from "./upcoming-consultations";
import { AvailabilityStats } from "./availability-stats";
import {
  Calendar,
  Clock,
  Users,
  Settings,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Loader,
} from "lucide-react";
import { DASHBOARD_LABELS } from "./messages";

interface AvailabilityDashboardProps {
  attorneyId: Id<"attorneys">;
}

export function AvailabilityDashboard({
  attorneyId,
}: AvailabilityDashboardProps) {
  const {
    availabilityProfile,
    upcomingConsultations,
    availabilityStats,
    isLoading,
    error,
    isOnline,
    toggleOnlineStatus,
  } = useAvailabilityDashboard(attorneyId);

  const renderHeader = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {DASHBOARD_LABELS.TITLE}
          </h1>
          <p className="text-gray-600">{DASHBOARD_LABELS.SUBTITLE}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
            />
            <span className="text-sm font-medium text-gray-700">
              {isOnline
                ? DASHBOARD_LABELS.STATUS.ONLINE
                : DASHBOARD_LABELS.STATUS.OFFLINE}
            </span>
            <button
              onClick={toggleOnlineStatus}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                isOnline
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {isOnline
                ? DASHBOARD_LABELS.ACTIONS.GO_OFFLINE
                : DASHBOARD_LABELS.ACTIONS.GO_ONLINE}
            </button>
          </div>

          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {DASHBOARD_LABELS.STATS.TODAYS_CONSULTATIONS}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {availabilityStats?.consultationsToday || 0}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {DASHBOARD_LABELS.STATS.AVAILABLE_HOURS_TODAY}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {availabilityStats?.availableHoursToday || 0}h
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {DASHBOARD_LABELS.STATS.THIS_WEEK_BOOKINGS}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {availabilityStats?.bookingsThisWeek || 0}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {DASHBOARD_LABELS.STATS.UTILIZATION_RATE}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {availabilityStats?.utilizationRate || 0}%
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Upcoming Consultations */}
      <div>
        <UpcomingConsultations
          consultations={upcomingConsultations}
          onReschedule={() => {
            /* TODO: Handle reschedule */
          }}
          onCancel={() => {
            /* TODO: Handle cancel */
          }}
        />
      </div>

      {/* Right Column - Availability Stats */}
      <div>
        <AvailabilityStats stats={availabilityStats} />
      </div>
    </div>
  );

  const renderError = () => (
    <div className="bg-white rounded-lg border border-red-200 p-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <div>
          <h3 className="font-semibold text-red-900">
            {DASHBOARD_LABELS.ERROR.TITLE}
          </h3>
          <p className="text-red-700 text-sm mt-1">
            {error || DASHBOARD_LABELS.ERROR.GENERIC_MESSAGE}
          </p>
        </div>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3">
        <Loader className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="text-gray-600">
          {DASHBOARD_LABELS.LOADING_MESSAGE}
        </span>
      </div>
    </div>
  );

  const renderWelcomeMessage = () => {
    if (availabilityProfile) return null;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              {DASHBOARD_LABELS.WELCOME.TITLE}
            </h3>
            <p className="text-blue-800 text-sm mb-4">
              {DASHBOARD_LABELS.WELCOME.MESSAGE}
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              {DASHBOARD_LABELS.WELCOME.CTA_BUTTON}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return renderLoading();
  }

  if (error) {
    return renderError();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {renderHeader()}
        {renderWelcomeMessage()}
        {renderQuickStats()}
        {renderMainContent()}
      </div>
    </div>
  );
}
