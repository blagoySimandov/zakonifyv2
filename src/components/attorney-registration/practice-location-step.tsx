'use client'

import { AttorneyRegistrationFormData } from './validation'
import { REGISTRATION_CONSTANTS } from './constants'
import { REGISTRATION_MESSAGES } from './messages'
import { PRACTICE_AREAS } from '@/constants'
import { Upload } from 'lucide-react'

interface PracticeLocationStepProps {
  formData: Partial<AttorneyRegistrationFormData>
  errors: Record<string, string[]>
  updateFormData: (updates: Partial<AttorneyRegistrationFormData>) => void
}

export function PracticeLocationStep({ formData, errors, updateFormData }: PracticeLocationStepProps) {
  const handlePracticeAreaChange = (area: string, checked: boolean) => {
    const currentAreas = formData.practiceAreas || []
    let newAreas: string[]

    if (checked) {
      newAreas = [...currentAreas, area]
    } else {
      newAreas = currentAreas.filter(a => a !== area)
    }

    updateFormData({ practiceAreas: newAreas })
  }


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          {REGISTRATION_CONSTANTS.STEP_TITLES.practiceAndLocation}
        </h2>
        <p className="text-gray-500 mb-6">
          {REGISTRATION_CONSTANTS.STEP_DESCRIPTIONS.practiceAndLocation}
        </p>
      </div>

      <div className="space-y-6">
        {/* Practice Areas */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-3">
            {REGISTRATION_CONSTANTS.LABELS.PRACTICE_AREAS} *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PRACTICE_AREAS.map((area) => (
              <label key={area} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.practiceAreas?.includes(area) || false}
                  onChange={(e) => handlePracticeAreaChange(area, e.target.checked)}
                  className="rounded text-blue-500"
                />
                <span className="text-sm text-gray-700">{area}</span>
              </label>
            ))}
          </div>
          {errors.practiceAreas && (
            <p className="text-red-500 text-sm mt-1">{errors.practiceAreas[0]}</p>
          )}
          <p className="text-gray-400 text-sm mt-2">
            {REGISTRATION_MESSAGES.HELP.PRACTICE_AREAS}
          </p>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-3">
            {REGISTRATION_CONSTANTS.LABELS.LOCATION} *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                value={formData.location?.city || ''}
                onChange={(e) => updateFormData({ 
                  location: { ...formData.location, city: e.target.value, state: formData.location?.state || '', country: formData.location?.country || 'USA' }
                })}
                placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.CITY}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['location.city'] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors['location.city'] && (
                <p className="text-red-500 text-sm mt-1">{errors['location.city'][0]}</p>
              )}
            </div>
            
            <div>
              <input
                type="text"
                value={formData.location?.state || ''}
                onChange={(e) => updateFormData({ 
                  location: { ...formData.location, state: e.target.value, city: formData.location?.city || '', country: formData.location?.country || 'USA' }
                })}
                placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.STATE}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['location.state'] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors['location.state'] && (
                <p className="text-red-500 text-sm mt-1">{errors['location.state'][0]}</p>
              )}
            </div>
            
            <div>
              <input
                type="text"
                value="Bulgaria"
                disabled
                className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-3">
            Profile Picture
          </label>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              {formData.profileImage ? (
                <img 
                  src={formData.profileImage} 
                  alt="Profile preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      updateFormData({ profileImage: event.target?.result as string })
                    }
                    reader.readAsDataURL(file)
                  }
                }}
                className="hidden"
                id="profile-picture-upload"
              />
              <label
                htmlFor="profile-picture-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </label>
              <p className="text-gray-400 text-xs mt-1">
                JPG, PNG or GIF (max 5MB)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}