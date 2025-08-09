'use client'

import { useState } from 'react'
import { AttorneyRegistrationFormData } from './validation'
import { REGISTRATION_CONSTANTS } from './constants'
import { REGISTRATION_MESSAGES } from './messages'
import { trpc } from '@/utils'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface ProfessionalInfoStepProps {
  formData: Partial<AttorneyRegistrationFormData>
  errors: Record<string, string[]>
  updateFormData: (updates: Partial<AttorneyRegistrationFormData>) => void
}

export function ProfessionalInfoStep({ formData, errors, updateFormData }: ProfessionalInfoStepProps) {
  const [barIdCheckTimeout, setBarIdCheckTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isCheckingBarId, setIsCheckingBarId] = useState(false)
  const [barIdTaken, setBarIdTaken] = useState(false)

  const checkBarIdQuery = trpc.attorneys.checkBarIdExists.useQuery(
    { barAssociationId: formData.barAssociationId || '' },
    { enabled: false }
  )

  const handleBarIdChange = (barId: string) => {
    updateFormData({ barAssociationId: barId })
    setBarIdTaken(false)
    setIsCheckingBarId(false)

    // Clear existing timeout
    if (barIdCheckTimeout) {
      clearTimeout(barIdCheckTimeout)
    }

    // Set new timeout to check bar ID after user stops typing
    if (barId.length >= 5) {
      setIsCheckingBarId(true)
      const timeout = setTimeout(() => {
        checkBarIdQuery
          .refetch()
          .then((res) => {
            if (!res.error) {
              setBarIdTaken(Boolean(res.data))
            } else {
              console.error('Bar ID check failed:', res.error)
              setBarIdTaken(false)
            }
          })
          .finally(() => setIsCheckingBarId(false))
      }, 500) // Check after 500ms of no typing

      setBarIdCheckTimeout(timeout)
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {REGISTRATION_CONSTANTS.STEP_TITLES.professional}
        </h2>
        <p className="text-gray-600 mb-6">
          {REGISTRATION_CONSTANTS.STEP_DESCRIPTIONS.professional}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {REGISTRATION_CONSTANTS.LABELS.BAR_ID} *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.barAssociationId || ''}
              onChange={(e) => handleBarIdChange(e.target.value)}
              placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.BAR_ID}
              className={`w-full px-4 py-4 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.barAssociationId || barIdTaken
                  ? 'border-red-300 bg-red-50 focus:ring-red-500'
                  : 'border-gray-200 hover:border-gray-300 focus:bg-white'
              }`}
            />
            {isCheckingBarId && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {!isCheckingBarId && !barIdTaken && formData.barAssociationId && formData.barAssociationId.length >= 5 && !errors.barAssociationId && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            )}
          </div>

          {errors.barAssociationId && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.barAssociationId[0]}
            </p>
          )}
          
          {barIdTaken && !errors.barAssociationId && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              Този номер в адвокатската колегия вече е регистриран
            </p>
          )}
          
          {!barIdTaken &&
            formData.barAssociationId &&
            formData.barAssociationId.length >= 5 &&
            !isCheckingBarId &&
            !errors.barAssociationId && (
              <p className="text-green-500 text-sm mt-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Номерът е свободен
              </p>
            )}
          
          <p className="text-gray-500 text-sm mt-2">
            {REGISTRATION_MESSAGES.HELP.BAR_ID}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {REGISTRATION_CONSTANTS.LABELS.YEARS_EXPERIENCE} *
          </label>
          <input
            type="number"
            min="0"
            max="70"
            value={formData.yearsOfExperience || ''}
            onChange={(e) => updateFormData({ yearsOfExperience: Number(e.target.value) })}
            placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.YEARS_EXPERIENCE}
            className={`w-full px-4 py-4 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.yearsOfExperience ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300 focus:bg-white'
            }`}
          />
          {errors.yearsOfExperience && (
            <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {REGISTRATION_CONSTANTS.LABELS.EDUCATION}
          </label>
          <input
            type="text"
            value={formData.education || ''}
            onChange={(e) => updateFormData({ education: e.target.value })}
            placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.EDUCATION}
            className={`w-full px-4 py-4 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.education ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300 focus:bg-white'
            }`}
          />
          {errors.education && (
            <p className="text-red-500 text-sm mt-1">{errors.education[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {REGISTRATION_CONSTANTS.LABELS.BIO}
          </label>
          <textarea
            rows={4}
            value={formData.bio || ''}
            onChange={(e) => updateFormData({ bio: e.target.value })}
            placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.BIO}
            className={`w-full px-4 py-4 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
              errors.bio ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300 focus:bg-white'
            }`}
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio[0]}</p>
          )}
          <p className="text-gray-500 text-sm mt-2">
            {REGISTRATION_MESSAGES.HELP.BIO_TIPS}
          </p>
        </div>
      </div>
    </div>
  )
}