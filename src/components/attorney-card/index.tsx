'use client'

import Link from 'next/link'
import { Attorney } from '@/types'
import { ATTORNEY_CARD_CONSTANTS } from './constants'

interface AttorneyCardProps {
  attorney: Attorney
}

export function AttorneyCard({ attorney }: AttorneyCardProps) {
  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          {attorney.profileImage ? (
            <img 
              src={attorney.profileImage} 
              alt={attorney.fullName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-xl font-semibold text-gray-500">
              {attorney.fullName.charAt(0)}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{attorney.fullName}</h3>
            {attorney.isVerified && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Verified
              </span>
            )}
          </div>
          
          <p className="text-gray-500 text-sm mt-1">
            {attorney.yearsOfExperience} {ATTORNEY_CARD_CONSTANTS.EXPERIENCE_SUFFIX}
          </p>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {attorney.practiceAreas.slice(0, 3).map((area) => (
              <span 
                key={area}
                className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded"
              >
                {area}
              </span>
            ))}
            {attorney.practiceAreas.length > 3 && (
              <span className="text-xs text-gray-500">
                +{attorney.practiceAreas.length - 3} more
              </span>
            )}
          </div>
          
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
            {attorney.bio}
          </p>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              {attorney.location.city}, {attorney.location.state}
            </div>
            <div className="text-lg font-semibold">
              ${attorney.hourlyRate}{ATTORNEY_CARD_CONSTANTS.HOURLY_RATE_SUFFIX}
            </div>
          </div>
          
          <Link 
            href={`/attorneys/${attorney._id}`}
            className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            {ATTORNEY_CARD_CONSTANTS.VIEW_PROFILE_TEXT}
          </Link>
        </div>
      </div>
    </div>
  )
}