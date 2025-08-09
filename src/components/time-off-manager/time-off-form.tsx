"use client";

import { useState, useEffect } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { TimeOffPeriod, TimeOffType } from "@/types/availability";
import { TIME_OFF_CONSTANTS } from "./constants";
import { X, Save, Loader } from "lucide-react";

interface TimeOffFormProps {
  attorneyId: Id<"attorneys">;
  initialData?: TimeOffPeriod | null;
  selectedDate?: Date | null;
  onSave: (
    data: Omit<TimeOffPeriod, "id" | "attorneyId" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function TimeOffForm({
  initialData,
  selectedDate,
  onSave,
  onCancel,
  isLoading,
}: TimeOffFormProps) {
  const [formData, setFormData] = useState({
    type: "vacation" as TimeOffType,
    title: "",
    startTime: Date.now(),
    endTime: Date.now() + 24 * 60 * 60 * 1000, // Next day
    isRecurring: false,
    reason: "",
    isAllDay: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        title: initialData.title || "",
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        isRecurring: initialData.isRecurring,
        reason: initialData.reason || "",
        isAllDay: true,
      });
    } else if (selectedDate) {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      setFormData((prev) => ({
        ...prev,
        startTime: startOfDay.getTime(),
        endTime: endOfDay.getTime(),
      }));
    }
  }, [initialData, selectedDate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = TIME_OFF_CONSTANTS.VALIDATION.TITLE_REQUIRED;
    }

    if (formData.endTime <= formData.startTime) {
      newErrors.endTime = TIME_OFF_CONSTANTS.VALIDATION.END_BEFORE_START;
    }

    if (formData.startTime < Date.now() && !initialData) {
      newErrors.startTime = TIME_OFF_CONSTANTS.VALIDATION.PAST_DATE;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSave({
      type: formData.type,
      title: formData.title,
      startTime: formData.startTime,
      endTime: formData.endTime,
      isRecurring: formData.isRecurring,
      reason: formData.reason,
    });
  };

  const formatDateForInput = (timestamp: number) => {
    return new Date(timestamp).toISOString().split("T")[0];
  };

  const handleDateChange = (
    field: "startTime" | "endTime",
    dateString: string,
  ) => {
    const date = new Date(dateString);
    if (formData.isAllDay) {
      if (field === "startTime") {
        date.setHours(0, 0, 0, 0);
      } else {
        date.setHours(23, 59, 59, 999);
      }
    }
    setFormData((prev) => ({
      ...prev,
      [field]: date.getTime(),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {initialData
              ? TIME_OFF_CONSTANTS.FORM.TITLE_EDIT
              : TIME_OFF_CONSTANTS.FORM.TITLE_ADD}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {TIME_OFF_CONSTANTS.FORM.TYPE_LABEL}
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as TimeOffType,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TIME_OFF_CONSTANTS.TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {TIME_OFF_CONSTANTS.FORM.TITLE_LABEL}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder={TIME_OFF_CONSTANTS.FORM.TITLE_PLACEHOLDER}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {TIME_OFF_CONSTANTS.FORM.START_DATE_LABEL}
              </label>
              <input
                type="date"
                value={formatDateForInput(formData.startTime)}
                onChange={(e) => handleDateChange("startTime", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startTime ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.startTime && (
                <p className="text-red-600 text-sm mt-1">{errors.startTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {TIME_OFF_CONSTANTS.FORM.END_DATE_LABEL}
              </label>
              <input
                type="date"
                value={formatDateForInput(formData.endTime)}
                onChange={(e) => handleDateChange("endTime", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endTime ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.endTime && (
                <p className="text-red-600 text-sm mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* All Day Toggle */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isAllDay}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isAllDay: e.target.checked,
                  }))
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {TIME_OFF_CONSTANTS.FORM.ALL_DAY_LABEL}
              </span>
            </label>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {TIME_OFF_CONSTANTS.FORM.REASON_LABEL}
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reason: e.target.value }))
              }
              placeholder={TIME_OFF_CONSTANTS.FORM.REASON_PLACEHOLDER}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {TIME_OFF_CONSTANTS.ACTIONS.CANCEL}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isLoading
                ? TIME_OFF_CONSTANTS.ACTIONS.SAVING
                : TIME_OFF_CONSTANTS.ACTIONS.SAVE}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
