"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface DebugAvailabilityProps {
  attorneyId: Id<"attorneys">;
}

export function DebugAvailability({ attorneyId }: DebugAvailabilityProps) {
  const debugData = useQuery(api.debug.debugAttorneyAvailability, { attorneyId });
  const createProfile = useMutation(api.debug.createBasicAvailabilityProfile);
  
  // Also test the actual availability calculation
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const availability = useQuery(api.availability.calculateAvailability, {
    attorneyId,
    startDate: startOfWeek.getTime(),
    endDate: endOfWeek.getTime(),
    consultationType: "video",
    duration: 60,
  });

  if (!debugData) {
    return <div className="p-4 bg-gray-100 rounded-lg">Loading debug data...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg space-y-6 text-sm">
      <h3 className="text-lg font-bold text-red-600">🐛 Availability Debug Info</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Attorney Info</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(debugData.attorney, null, 2)}
          </pre>
        </div>

        {/* Profile Info */}
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Availability Profile</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(debugData.profile, null, 2)}
          </pre>
        </div>

        {/* Consultations */}
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Existing Consultations ({debugData.consultations.length})</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(debugData.consultations, null, 2)}
          </pre>
        </div>

        {/* Blocked Periods */}
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Blocked Periods ({debugData.blockedPeriods.length})</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(debugData.blockedPeriods, null, 2)}
          </pre>
        </div>

        {/* Reservations */}
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Active Reservations ({debugData.reservations.length})</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(debugData.reservations, null, 2)}
          </pre>
        </div>

        {/* Calculated Availability */}
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Calculated Availability</h4>
          {availability ? (
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify({
                totalSlots: availability.slots.length,
                slots: availability.slots.slice(0, 3), // Show first 3 slots
                nextAvailable: availability.nextAvailable,
                calculatedAt: new Date(availability.calculatedAt).toISOString(),
              }, null, 2)}
            </pre>
          ) : (
            <div>Loading availability...</div>
          )}
        </div>
      </div>

      <div className="bg-yellow-100 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Quick Debug Summary</h4>
        <ul className="space-y-1 text-sm">
          <li>✅ Attorney exists: {debugData.debugInfo.hasAttorney ? 'YES' : 'NO'}</li>
          <li>✅ Has profile: {debugData.debugInfo.hasProfile ? 'YES' : 'NO'}</li>
          <li>✅ Profile active: {debugData.debugInfo.profileIsActive ? 'YES' : 'NO'}</li>
          <li>✅ Has working hours: {debugData.debugInfo.hasWorkingHours ? 'YES' : 'NO'}</li>
          <li>🔍 Available slots: {availability?.slots.length || 0}</li>
          <li>📅 Existing consultations: {debugData.debugInfo.consultationCount}</li>
          <li>🚫 Blocked periods: {debugData.debugInfo.blockedPeriodsCount}</li>
          <li>⏰ Current time: {debugData.currentTime}</li>
        </ul>
        
        {!debugData.debugInfo.hasProfile && (
          <div className="mt-4 p-3 bg-red-100 rounded-lg">
            <p className="text-red-800 font-semibold mb-2">🚨 ISSUE FOUND: No availability profile!</p>
            <p className="text-red-700 text-sm mb-3">
              This attorney doesn't have an availability profile set up, which means no slots can be generated.
            </p>
            <button
              onClick={() => createProfile({ attorneyId })}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              🔧 Create Basic Availability Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}