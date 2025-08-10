"use client";

import Image from "next/image";
import { Attorney } from "@/types";
import { ATTORNEY_CARD_CONSTANTS } from "./constants";
import { DollarSign, User, Star, Video } from "lucide-react";
import { SEARCH_CONSTANTS } from "../attorney-search/constants";

interface AttorneyCardProps {
  attorney: Attorney;
}

export function AttorneyCard({ attorney }: AttorneyCardProps) {
  const getNextAvailableSlot = () => {
    // Mock logic - in real app this would come from API
    const slots = ["11:00", "14:30", "16:00"];
    const days = ["today", "tomorrow", "Monday"];
    const randomSlot = slots[Math.floor(Math.random() * slots.length)];
    const randomDay = days[Math.floor(Math.random() * days.length)];
    return { time: randomSlot, day: randomDay };
  };

  const nextSlot = getNextAvailableSlot();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        {/* Profile Image */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
            {attorney.profileImage ? (
              <Image
                src={attorney.profileImage}
                alt={attorney.fullName}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {attorney.fullName}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                {/* Star Rating */}
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <Star className="w-4 h-4 text-gray-300" />
                </div>
                <span className="text-sm text-gray-600">2 reviews</span>
              </div>

              <div className="text-sm text-gray-600 mb-1">
                {attorney.practiceAreas.slice(0, 2).join(" • ")} •{" "}
                {attorney.location.city}
              </div>
            </div>

            {attorney.isVerified && (
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                {ATTORNEY_CARD_CONSTANTS.VERIFIED_TEXT}
              </span>
            )}
          </div>

          {/* Consultation Options */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Video className="w-4 h-4" />
              <span>Video consultations</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>Published prices</span>
            </div>
          </div>

          {/* Availability */}
          <div className="mb-4">
            <div className="text-sm text-gray-600">
              <span className="text-blue-600">
                {SEARCH_CONSTANTS.AVAILABILITY.EARLIEST_SLOT}
              </span>{" "}
              <span className="font-medium">
                {nextSlot.day} at {nextSlot.time}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            {SEARCH_CONSTANTS.ACTIONS.BOOK_CONSULTATION}
          </button>
        </div>
      </div>
    </div>
  );
}
