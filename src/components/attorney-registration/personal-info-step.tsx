'use client'

import { useState } from 'react'
import { AttorneyRegistrationFormData } from './validation'
import { REGISTRATION_CONSTANTS } from './constants'
import { trpc } from '@/utils'

interface PersonalInfoStepProps {
  formData: Partial<AttorneyRegistrationFormData>
  errors: Record<string, string[]>
  updateFormData: (updates: Partial<AttorneyRegistrationFormData>) => void
}

export function PersonalInfoStep({ formData, errors, updateFormData }: PersonalInfoStepProps) {
  const [emailCheckTimeout, setEmailCheckTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailTaken, setEmailTaken] = useState(false)

  const checkEmailMutation = trpc.attorneys.checkEmailExists.useQuery(
    { email: formData.email || '' },
    { 
      enabled: false, // We'll trigger this manually
      onSuccess: (exists) => {
        setEmailTaken(exists)
        setIsCheckingEmail(false)
      },
      onError: (error) => {
        console.error('Email check failed:', error)
        setIsCheckingEmail(false)
        setEmailTaken(false)
      }
    }
  )

  const handleEmailChange = (email: string) => {
    updateFormData({ email })
    setEmailTaken(false)
    setIsCheckingEmail(false)
    
    // Clear existing timeout
    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout)
    }
    
    // Set new timeout to check email after user stops typing
    if (email.length > 0 && email.includes('@')) {
      setIsCheckingEmail(true)
      const timeout = setTimeout(() => {
        checkEmailMutation.refetch()
      }, 500) // Check after 500ms of no typing
      
      setEmailCheckTimeout(timeout)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          {REGISTRATION_CONSTANTS.STEP_TITLES.personal}
        </h2>
        <p className="text-gray-500 mb-6">
          {REGISTRATION_CONSTANTS.STEP_DESCRIPTIONS.personal}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {REGISTRATION_CONSTANTS.LABELS.FULL_NAME} *
          </label>
          <input
            type="text"
            value={formData.fullName || ''}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.FULL_NAME}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {REGISTRATION_CONSTANTS.LABELS.EMAIL} *
          </label>
          <div className="relative">
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.EMAIL}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email || emailTaken ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {isCheckingEmail && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
          )}
          {emailTaken && !errors.email && (
            <p className="text-red-500 text-sm mt-1">This email is already registered</p>
          )}
          {!emailTaken && formData.email && formData.email.includes('@') && !isCheckingEmail && !errors.email && (
            <p className="text-green-500 text-sm mt-1">✓ Email available</p>
          )}
          <p className="text-gray-400 text-sm mt-1">
            This will be your login email and how clients contact you
          </p>
        </div>
      </div>
    </div>
  )
}