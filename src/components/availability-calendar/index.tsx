"use client";

import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { AvailableSlot, ConsultationType } from "@/types/availability";
import { useAvailabilityCalendar } from "./hooks";
import { CALENDAR_CONSTANTS } from "./constants";
import { CalendarGrid } from "./calendar-grid";
import { TimeSlotList } from "./time-slot-list";
import { BookingModal } from "./booking-modal";
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Loader,
  AlertCircle
} from "lucide-react";

interface AvailabilityCalendarProps {
  attorneyId: Id<"attorneys">;
  onSlotSelected?: (slot: AvailableSlot) => void;
  consultationType?: ConsultationType;
  duration?: number; // minutes
  showBookingModal?: boolean;
  clientId?: Id<"clients">;
}

export function AvailabilityCalendar({
  attorneyId,
  onSlotSelected,
  consultationType = 'video',
  duration = 60,
  showBookingModal = true,
  clientId,
}: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const {
    availableSlots,
    isLoading,
    error,
    nextAvailableSlot,
    reserveSlot,
    releaseSlot,
    refreshAvailability,
  } = useAvailabilityCalendar(attorneyId, selectedDate, consultationType, duration);

  const handleSlotClick = async (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    onSlotSelected?.(slot);
    
    // Reserve the slot if booking modal is enabled
    if (showBookingModal && clientId) {
      try {
        await reserveSlot(slot, clientId);
      } catch (err) {
        console.error('Failed to reserve slot:', err);
      }
    }
  };

  const handleBookingCancel = async () => {
    if (selectedSlot) {
      try {
        await releaseSlot(selectedSlot);
      } catch (err) {
        console.error('Failed to release slot:', err);
      }
    }
    setSelectedSlot(null);
  };

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setSelectedDate(newDate);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          {CALENDAR_CONSTANTS.TITLE}
        </h2>
        <p className="text-gray-600 mt-1">
          {CALENDAR_CONSTANTS.SUBTITLE}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {nextAvailableSlot && (
          <div className="text-right">
            <p className="text-sm text-gray-600">{CALENDAR_CONSTANTS.NEXT_AVAILABLE}</p>
            <p className="font-medium text-blue-600">
              {new Date(nextAvailableSlot.startTime).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short', 
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}
        
        <button
          onClick={() => handleSlotClick(nextAvailableSlot!)}
          disabled={!nextAvailableSlot}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {CALENDAR_CONSTANTS.BOOK_NEXT_AVAILABLE}
        </button>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <select
          value={consultationType}
          onChange={() => {/* TODO: Update consultation type */}}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="video">Video Call</option>
          <option value="phone">Phone Call</option>
          <option value="in-person">In-Person</option>
        </select>
        
        <select
          value={duration}
          onChange={() => {/* TODO: Update duration */}}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={90}>1.5 hours</option>
          <option value={120}>2 hours</option>
        </select>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            viewMode === 'calendar'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-white'
          }`}
        >
          Calendar
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            viewMode === 'list'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-white'
          }`}
        >
          List
        </button>
      </div>
    </div>
  );

  const renderDateNavigation = () => (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => handleDateNavigation('prev')}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous Week
      </button>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {selectedDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </h3>
        <p className="text-sm text-gray-600">
          Week of {selectedDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      <button
        onClick={() => handleDateNavigation('next')}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Next Week
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  const renderError = () => (
    <div className="text-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 font-medium">{CALENDAR_CONSTANTS.ERROR_LOADING}</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={refreshAvailability}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3">
        <Loader className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="text-gray-600">{CALENDAR_CONSTANTS.LOADING_MESSAGE}</span>
      </div>
    </div>
  );

  const renderNoAvailability = () => (
    <div className="text-center py-12">
      <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {CALENDAR_CONSTANTS.NO_AVAILABILITY}
      </h3>
      <p className="text-gray-500 mb-6">
        {CALENDAR_CONSTANTS.TRY_DIFFERENT_DATES}
      </p>
      <button
        onClick={() => handleDateNavigation('next')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Next Week
      </button>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return renderLoading();
    if (error) return renderError();
    if (!availableSlots || availableSlots.length === 0) return renderNoAvailability();

    if (viewMode === 'calendar') {
      return (
        <CalendarGrid
          availableSlots={availableSlots}
          selectedDate={selectedDate}
          onSlotClick={handleSlotClick}
          consultationType={consultationType}
        />
      );
    } else {
      return (
        <TimeSlotList
          availableSlots={availableSlots}
          onSlotClick={handleSlotClick}
          consultationType={consultationType}
        />
      );
    }
  };

  return (
    <div className="bg-white">
      {renderHeader()}
      {renderFilters()}
      {renderDateNavigation()}
      
      <div className="border border-gray-200 rounded-lg">
        {renderContent()}
      </div>
      
      {/* Booking Modal */}
      {showBookingModal && selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          attorneyId={attorneyId}
          clientId={clientId}
          onConfirm={() => {
            setSelectedSlot(null);
            // Refresh availability after booking
            refreshAvailability();
          }}
          onCancel={handleBookingCancel}
        />
      )}
    </div>
  );
}