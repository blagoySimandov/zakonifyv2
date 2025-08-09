"use client";

import { AvailableSlot, ConsultationType } from "@/types/availability";
import { CALENDAR_CONSTANTS } from "./constants";
import { Calendar, Clock } from "lucide-react";

interface CalendarGridProps {
  availableSlots: AvailableSlot[];
  selectedDate: Date;
  onSlotClick: (slot: AvailableSlot) => void;
  consultationType: ConsultationType;
}

export function CalendarGrid({ 
  availableSlots, 
  selectedDate, 
  onSlotClick 
}: CalendarGridProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const groupSlotsByDate = () => {
    const grouped: { [key: string]: AvailableSlot[] } = {};
    
    availableSlots.forEach(slot => {
      const date = new Date(slot.startTime).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });
    
    return grouped;
  };

  const slotsByDate = groupSlotsByDate();
  const dates = Object.keys(slotsByDate).sort();

  const renderSlot = (slot: AvailableSlot) => (
    <button
      key={slot.startTime}
      onClick={() => onSlotClick(slot)}
      className="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors group"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-blue-900">
          {formatTime(slot.startTime)}
        </span>
        <span className="text-xs text-blue-600">
          ${slot.price}
        </span>
      </div>
    </button>
  );

  const renderDateColumn = (dateString: string) => {
    const date = new Date(dateString);
    const slots = slotsByDate[dateString] || [];
    
    return (
      <div key={dateString} className="border-r border-gray-200 last:border-r-0">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="text-lg font-bold text-gray-900">
              {date.getDate()}
            </div>
            <div className="text-xs text-gray-500">
              {slots.length} {CALENDAR_CONSTANTS.CALENDAR_GRID.TIME_SLOTS_AVAILABLE}
            </div>
          </div>
        </div>
        
        <div className="p-3 space-y-2 min-h-[300px]">
          {slots.length > 0 ? (
            slots.map(renderSlot)
          ) : (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {CALENDAR_CONSTANTS.CALENDAR_GRID.NO_SLOTS_TODAY}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (dates.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">
          No available time slots for the selected week
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 divide-x divide-gray-200">
      {/* Generate columns for each day of the week */}
      {Array.from({ length: 7 }, (_, i) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() - date.getDay() + i);
        const dateString = date.toDateString();
        
        return renderDateColumn(dateString);
      })}
    </div>
  );
}