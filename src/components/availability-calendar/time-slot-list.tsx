"use client";

import { AvailableSlot, ConsultationType } from "@/types/availability";
import { CALENDAR_CONSTANTS } from "./constants";
import { Clock, Video, Phone, MapPin, DollarSign } from "lucide-react";

interface TimeSlotListProps {
  availableSlots: AvailableSlot[];
  onSlotClick: (slot: AvailableSlot) => void;
  consultationType: ConsultationType;
}

export function TimeSlotList({
  availableSlots,
  onSlotClick,
}: TimeSlotListProps) {
  const getConsultationTypeIcon = (type: ConsultationType) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "phone":
        return <Phone className="w-4 h-4" />;
      case "in-person":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const dateString = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    if (isToday) {
      return { date: "Today", time: timeString };
    } else if (isTomorrow) {
      return { date: "Tomorrow", time: timeString };
    } else {
      return { date: dateString, time: timeString };
    }
  };

  const renderSlot = (slot: AvailableSlot) => {
    const { date, time } = formatDateTime(slot.startTime);

    return (
      <button
        key={slot.startTime}
        onClick={() => onSlotClick(slot)}
        className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-blue-600">
              {getConsultationTypeIcon(slot.consultationType)}
              <span className="font-medium text-gray-900">{date}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold">{slot.price}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-lg font-medium">{time}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium group-hover:bg-blue-700 transition-colors">
            <span>{CALENDAR_CONSTANTS.TIME_SLOT_LIST.SELECT_SLOT}</span>
          </div>
        </div>

        {slot.isEmergencySlot && (
          <div className="mt-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
            Emergency Slot Available
          </div>
        )}
      </button>
    );
  };

  const groupSlotsByDay = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const groups: { [key: string]: AvailableSlot[] } = {
      today: [],
      tomorrow: [],
      thisWeek: [],
      nextWeek: [],
    };

    availableSlots.forEach((slot) => {
      const slotDate = new Date(slot.startTime);

      if (slotDate.toDateString() === today.toDateString()) {
        groups.today.push(slot);
      } else if (slotDate.toDateString() === tomorrow.toDateString()) {
        groups.tomorrow.push(slot);
      } else if (
        slotDate < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      ) {
        groups.thisWeek.push(slot);
      } else {
        groups.nextWeek.push(slot);
      }
    });

    return groups;
  };

  const slotGroups = groupSlotsByDay();

  const renderGroup = (title: string, slots: AvailableSlot[]) => {
    if (slots.length === 0) return null;

    return (
      <div key={title} className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {title} ({slots.length} available)
        </h3>
        <div className="space-y-3">{slots.map(renderSlot)}</div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {CALENDAR_CONSTANTS.TIME_SLOT_LIST.TITLE}
        </h2>
        <p className="text-gray-600">
          {availableSlots.length} time slots available
        </p>
      </div>

      {renderGroup(CALENDAR_CONSTANTS.TIME_SLOT_LIST.TODAY, slotGroups.today)}
      {renderGroup(
        CALENDAR_CONSTANTS.TIME_SLOT_LIST.TOMORROW,
        slotGroups.tomorrow,
      )}
      {renderGroup(
        CALENDAR_CONSTANTS.TIME_SLOT_LIST.THIS_WEEK,
        slotGroups.thisWeek,
      )}
      {renderGroup(
        CALENDAR_CONSTANTS.TIME_SLOT_LIST.NEXT_WEEK,
        slotGroups.nextWeek,
      )}

      {availableSlots.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No available time slots found</p>
        </div>
      )}
    </div>
  );
}
