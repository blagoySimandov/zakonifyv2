"use client";

import { AvailabilityStats as AvailabilityStatsType } from "@/types/availability";
import { TrendingUp, Clock, Calendar, BarChart3 } from "lucide-react";
import { DASHBOARD_LABELS } from "./messages";

interface AvailabilityStatsProps {
  stats: AvailabilityStatsType | null;
  timeZone?: string;
}

export function AvailabilityStats({ stats }: AvailabilityStatsProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const renderPeakHours = () => {
    if (!stats?.peakHours || stats.peakHours.length === 0) {
      return <p className="text-sm text-gray-500">No data available</p>;
    }

    return (
      <div className="space-y-1">
        {stats.peakHours.slice(0, 3).map((timeSlot, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {formatTime(timeSlot.start)} - {formatTime(timeSlot.end)}
            </span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-xs text-gray-500">Peak</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLeastBookedDays = () => {
    if (!stats?.leastBookedDays || stats.leastBookedDays.length === 0) {
      return <p className="text-sm text-gray-500">No data available</p>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {stats.leastBookedDays.map((day) => (
          <span
            key={day}
            className="px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-sm font-medium"
          >
            {
              DASHBOARD_LABELS.DAY_SHORT_NAMES[
                day as keyof typeof DASHBOARD_LABELS.DAY_SHORT_NAMES
              ]
            }
          </span>
        ))}
      </div>
    );
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return "text-green-600 bg-green-50";
    if (rate >= 60) return "text-blue-600 bg-blue-50";
    if (rate >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getUtilizationLabel = (rate: number) => {
    if (rate >= 80) return "Excellent";
    if (rate >= 60) return "Good";
    if (rate >= 40) return "Moderate";
    return "Low";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          {DASHBOARD_LABELS.AVAILABILITY_STATS.TITLE}
        </h3>
      </div>

      {stats ? (
        <div className="space-y-6">
          {/* Utilization Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Weekly Utilization
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getUtilizationColor(stats.utilizationRate)}`}
              >
                {getUtilizationLabel(stats.utilizationRate)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(stats.utilizationRate, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.utilizationRate}% of available time booked
            </p>
          </div>

          {/* Weekly Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Total Hours
                </span>
              </div>
              <p className="text-lg font-bold text-blue-700">
                {stats.totalHoursPerWeek}h
              </p>
              <p className="text-xs text-blue-600">per week</p>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  Avg Slots
                </span>
              </div>
              <p className="text-lg font-bold text-green-700">
                {stats.averageSlotsPerDay}
              </p>
              <p className="text-xs text-green-600">per day</p>
            </div>
          </div>

          {/* Peak Hours */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {DASHBOARD_LABELS.AVAILABILITY_STATS.PEAK_HOURS}
            </h4>
            {renderPeakHours()}
          </div>

          {/* Least Booked Days */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              {DASHBOARD_LABELS.AVAILABILITY_STATS.LEAST_BOOKED_DAYS}
            </h4>
            {renderLeastBookedDays()}
            <p className="text-xs text-gray-500 mt-2">
              Consider promoting availability or adjusting rates for these days
            </p>
          </div>

          {/* Quick Insights */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-900 mb-2">Quick Insights</h4>
            <div className="space-y-1 text-sm text-gray-600">
              {stats.utilizationRate > 80 && (
                <p className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Your schedule is well utilized
                </p>
              )}
              {stats.utilizationRate < 40 && (
                <p className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  Consider promoting your availability
                </p>
              )}
              {stats.leastBookedDays.length > 3 && (
                <p className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Multiple days have low booking rates
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {DASHBOARD_LABELS.AVAILABILITY_STATS.NO_DATA}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Statistics will appear after you receive some bookings
          </p>
        </div>
      )}
    </div>
  );
}
