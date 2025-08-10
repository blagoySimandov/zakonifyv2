"use client";

import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { TimeOffPeriod, TimeOffType } from "@/types/availability";
import { useTimeOffManager } from "./hooks";
import { TIME_OFF_CONSTANTS } from "./constants";
import { TimeOffCalendar } from "./time-off-calendar";
import { TimeOffForm } from "./time-off-form";
import { TimeOffList } from "./time-off-list";
import { Calendar, Plus, AlertCircle, Loader, Filter } from "lucide-react";

interface TimeOffManagerProps {
  attorneyId: Id<"attorneys">;
  onClose?: () => void;
}

export function TimeOffManager({ attorneyId, onClose }: TimeOffManagerProps) {
  const {
    timeOffPeriods,
    isLoading,
    error,
    isAdding,
    addTimeOff,
    deleteTimeOff,
  } = useTimeOffManager(attorneyId);

  const [showForm, setShowForm] = useState(false);
  const [editingTimeOff, setEditingTimeOff] = useState<TimeOffPeriod | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<TimeOffType | "all">("all");

  const handleAddTimeOff = async (
    data: Omit<TimeOffPeriod, "id" | "attorneyId" | "createdAt" | "updatedAt">,
  ) => {
    await addTimeOff(data);
    setShowForm(false);
    setSelectedDate(null);
  };

  const handleEditTimeOff = (timeOff: TimeOffPeriod) => {
    setEditingTimeOff(timeOff);
    setShowForm(true);
  };

  const handleDeleteTimeOff = async (id: string) => {
    if (window.confirm(TIME_OFF_CONSTANTS.CONFIRMATIONS.DELETE)) {
      await deleteTimeOff(id);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const filteredTimeOffPeriods =
    filterType === "all"
      ? timeOffPeriods
      : timeOffPeriods.filter((period) => period.type === filterType);

  const renderHeader = () => (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {TIME_OFF_CONSTANTS.TITLE}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {TIME_OFF_CONSTANTS.SUBTITLE}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {TIME_OFF_CONSTANTS.ACTIONS.ADD_TIME_OFF}
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Filter className="w-4 h-4" />
          Filter by type:
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as TimeOffType | "all")}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All Types</option>
          <option value="vacation">Vacation</option>
          <option value="holiday">Holiday</option>
          <option value="sick">Sick Leave</option>
          <option value="court">Court Appearance</option>
          <option value="continuing-education">Continuing Education</option>
          <option value="unavailable">Unavailable</option>
        </select>

        <div className="ml-auto text-sm text-gray-600">
          {filteredTimeOffPeriods.length}{" "}
          {filteredTimeOffPeriods.length === 1 ? "period" : "periods"}
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="p-4 bg-red-50 border-l-4 border-red-400">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
        <p className="text-red-700">{error}</p>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3">
        <Loader className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="text-gray-600">
          {TIME_OFF_CONSTANTS.LOADING_MESSAGE}
        </span>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="flex h-[600px]">
      {/* Calendar View */}
      <div className="flex-1 p-6 border-r border-gray-200">
        <TimeOffCalendar
          timeOffPeriods={filteredTimeOffPeriods}
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />
      </div>

      {/* Time Off List */}
      <div className="w-80 overflow-y-auto">
        <TimeOffList
          timeOffPeriods={filteredTimeOffPeriods}
          onEdit={handleEditTimeOff}
          onDelete={handleDeleteTimeOff}
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg">{renderLoading()}</div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      {renderHeader()}
      {error && renderError()}
      {renderFilters()}
      {renderContent()}

      {/* Time Off Form Modal */}
      {showForm && (
        <TimeOffForm
          attorneyId={attorneyId}
          initialData={editingTimeOff}
          selectedDate={selectedDate}
          onSave={handleAddTimeOff}
          onCancel={() => {
            setShowForm(false);
            setEditingTimeOff(null);
            setSelectedDate(null);
          }}
          isLoading={isAdding}
        />
      )}
    </div>
  );
}
