'use client'

import { AttorneyRegistrationFormData } from './validation'
import { REGISTRATION_CONSTANTS } from './constants'
import { REGISTRATION_MESSAGES } from './messages'

interface ProfessionalInfoStepProps {
  formData: Partial<AttorneyRegistrationFormData>
  errors: Record<string, string[]>
  updateFormData: (updates: Partial<AttorneyRegistrationFormData>) => void
}

export function ProfessionalInfoStep({ formData, errors, updateFormData }: ProfessionalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          {REGISTRATION_CONSTANTS.STEP_TITLES.professional}
        </h2>
        <p className="text-gray-500 mb-6">
          {REGISTRATION_CONSTANTS.STEP_DESCRIPTIONS.professional}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {REGISTRATION_CONSTANTS.LABELS.BAR_ID} *
          </label>
          <input
            type="text"
            value={formData.barAssociationId || ''}
            onChange={(e) => updateFormData({ barAssociationId: e.target.value })}
            placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.BAR_ID}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.barAssociationId ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          />
          {errors.barAssociationId && (
            <p className="text-red-500 text-sm mt-1">{errors.barAssociationId[0]}</p>
          )}
          <p className="text-gray-400 text-sm mt-1">
            {REGISTRATION_MESSAGES.HELP.BAR_ID}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {REGISTRATION_CONSTANTS.LABELS.YEARS_EXPERIENCE} *
          </label>
          <input
            type="number"
            min="0"
            max="70"
            value={formData.yearsOfExperience || ''}
            onChange={(e) => updateFormData({ yearsOfExperience: Number(e.target.value) })}
            placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.YEARS_EXPERIENCE}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.yearsOfExperience ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          />
          {errors.yearsOfExperience && (
            <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {REGISTRATION_CONSTANTS.LABELS.EDUCATION}
          </label>
          <input
            type="text"
            value={formData.education || ''}
            onChange={(e) => updateFormData({ education: e.target.value })}
            placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.EDUCATION}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.education ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          />
          {errors.education && (
            <p className="text-red-500 text-sm mt-1">{errors.education[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {REGISTRATION_CONSTANTS.LABELS.BIO}
          </label>
          <textarea
            rows={4}
            value={formData.bio || ''}
            onChange={(e) => updateFormData({ bio: e.target.value })}
            placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.BIO}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              errors.bio ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio[0]}</p>
          )}
          <p className="text-gray-400 text-sm mt-1">
            {REGISTRATION_MESSAGES.HELP.BIO_TIPS}
          </p>
        </div>
      </div>
    </div>
  )
}