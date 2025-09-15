"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ATTORNEY_PROFILE_MESSAGES } from "@/messages";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { ConsultationType, TimeSlot } from "./hooks";

interface SlotSelectionProps {
  attorneyId: Id<"attorneys">;
  consultationType: ConsultationType;
  selectedSlot: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
}

export function SlotSelection({
  attorneyId,
  consultationType,
  selectedSlot,
  onSelect,
}: SlotSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Get available slots for the selected date range
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const availability = useQuery(api.availability.calculateAvailability, {
    attorneyId,
    startDate: startOfWeek.getTime(),
    endDate: endOfWeek.getTime(),
    consultationType: consultationType.type,
    duration: consultationType.duration,
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('bg-BG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  };

  const formatTime = (timestamp: number) => {
    return new Intl.DateTimeFormat('bg-BG', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getSlotsForDate = (date: Date): TimeSlot[] => {
    if (!availability?.slots) return [];
    
    return availability.slots.filter((slot: TimeSlot) => {
      const slotDate = new Date(slot.startTime);
      return isSameDay(slotDate, date);
    });
  };

  const hasAvailableSlots = (date: Date): boolean => {
    return getSlotsForDate(date).length > 0;
  };

  const isDateSelectable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && hasAvailableSlots(date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = new Intl.DateTimeFormat('bg-BG', {
    month: 'long',
    year: 'numeric',
  }).format(currentMonth);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {ATTORNEY_PROFILE_MESSAGES.BOOKING.STEPS.DATE_TIME}
        </h3>
        <p className="text-gray-600">
          Изберете дата и час за вашата консултация
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="bg-gray-50 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900 capitalize">
              {monthYear}
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-white rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-white rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div key={index} className="aspect-square">
                {day && (
                  <button
                    onClick={() => day && isDateSelectable(day) && setSelectedDate(day)}
                    disabled={!day || !isDateSelectable(day)}
                    className={`w-full h-full rounded-xl text-sm font-medium transition-all duration-200 ${
                      day && isSameDay(day, selectedDate)
                        ? "bg-primary-600 text-white shadow-lg"
                        : day && hasAvailableSlots(day)
                          ? "bg-white hover:bg-primary-50 hover:text-primary-600 text-gray-900"
                          : "text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {day?.getDate()}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Available Time Slots */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {ATTORNEY_PROFILE_MESSAGES.BOOKING.SLOT_SELECTION.AVAILABLE_TIMES}
          </h4>
          
          <div className="mb-4 p-4 bg-primary-50 rounded-2xl">
            <p className="text-primary-800 font-medium">
              {formatDate(selectedDate)}
            </p>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {getSlotsForDate(selectedDate).length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {ATTORNEY_PROFILE_MESSAGES.BOOKING.SLOT_SELECTION.NO_SLOTS_AVAILABLE}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {ATTORNEY_PROFILE_MESSAGES.BOOKING.SLOT_SELECTION.SELECT_DIFFERENT_DATE}
                </p>
              </div>
            ) : (
              getSlotsForDate(selectedDate).map((slot, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(slot)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                    selectedSlot?.startTime === slot.startTime
                      ? "border-primary-600 bg-primary-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        selectedSlot?.startTime === slot.startTime
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`font-semibold ${
                          selectedSlot?.startTime === slot.startTime
                            ? "text-primary-900"
                            : "text-gray-900"
                        }`}>
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {consultationType.duration} {ATTORNEY_PROFILE_MESSAGES.BOOKING.TIME_LABELS.MINUTES}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`text-lg font-bold ${
                      selectedSlot?.startTime === slot.startTime
                        ? "text-primary-700"
                        : "text-gray-900"
                    }`}>
                      €{slot.price}
                    </div>
                  </div>

                  {selectedSlot?.startTime === slot.startTime && (
                    <div className="mt-3 px-3 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium text-center">
                      {ATTORNEY_PROFILE_MESSAGES.BOOKING.SLOT_SELECTION.SELECTED_TIME}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}