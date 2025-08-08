"use client";

import { AttorneyRegistrationFormData } from "./validation";
import { REGISTRATION_CONSTANTS } from "./constants";
import { REGISTRATION_MESSAGES } from "./messages";

type FixedFeePackage = NonNullable<
  AttorneyRegistrationFormData["fixedFeePackages"]
>[number];

interface PricingStepProps {
  formData: Partial<AttorneyRegistrationFormData>;
  errors: Record<string, string[]>;
  updateFormData: (updates: Partial<AttorneyRegistrationFormData>) => void;
  addFixedFeePackage: () => void;
  removeFixedFeePackage: (index: number) => void;
  updateFixedFeePackage: (
    index: number,
    updates: Partial<FixedFeePackage>
  ) => void;
}

export function PricingStep({
  formData,
  errors,
  updateFormData,
  addFixedFeePackage,
  removeFixedFeePackage,
  updateFixedFeePackage,
}: PricingStepProps) {
  const packages = formData.fixedFeePackages || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          {REGISTRATION_CONSTANTS.STEP_TITLES.pricing}
        </h2>
        <p className="text-gray-500 mb-6">
          {REGISTRATION_CONSTANTS.STEP_DESCRIPTIONS.pricing}
        </p>
      </div>

      <div className="space-y-6">
        {/* Hourly Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {REGISTRATION_CONSTANTS.LABELS.HOURLY_RATE} *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              min="50"
              max="2000"
              value={formData.hourlyRate || ""}
              onChange={(e) =>
                updateFormData({ hourlyRate: Number(e.target.value) })
              }
              placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.HOURLY_RATE}
              className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.hourlyRate
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              }`}
            />
          </div>
          {errors.hourlyRate && (
            <p className="text-red-500 text-sm mt-1">{errors.hourlyRate[0]}</p>
          )}
          <p className="text-gray-400 text-sm mt-1">
            {REGISTRATION_MESSAGES.HELP.HOURLY_RATE}
          </p>
        </div>

        {/* Fixed Fee Packages */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-600">
              {REGISTRATION_CONSTANTS.LABELS.FIXED_PACKAGES}
            </label>
            <button
              type="button"
              onClick={addFixedFeePackage}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              {REGISTRATION_CONSTANTS.BUTTONS.ADD_PACKAGE}
            </button>
          </div>

          {packages.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-2">No fixed-fee packages yet</p>
              <p className="text-gray-400 text-sm">
                {REGISTRATION_MESSAGES.HELP.PACKAGES}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-700">
                      Package #{index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeFixedFeePackage(index)}
                      className="text-red-500 hover:text-red-700 text-sm">
                      {REGISTRATION_CONSTANTS.BUTTONS.REMOVE_PACKAGE}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={pkg.name || ""}
                        onChange={(e) =>
                          updateFixedFeePackage(index, { name: e.target.value })
                        }
                        placeholder={
                          REGISTRATION_CONSTANTS.PLACEHOLDERS.PACKAGE_NAME
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        value={pkg.description || ""}
                        onChange={(e) =>
                          updateFixedFeePackage(index, {
                            description: e.target.value,
                          })
                        }
                        placeholder={
                          REGISTRATION_CONSTANTS.PLACEHOLDERS
                            .PACKAGE_DESCRIPTION
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="100"
                        max="50000"
                        value={pkg.price || ""}
                        onChange={(e) =>
                          updateFixedFeePackage(index, {
                            price: Number(e.target.value),
                          })
                        }
                        placeholder={
                          REGISTRATION_CONSTANTS.PLACEHOLDERS.PACKAGE_PRICE
                        }
                        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {errors.fixedFeePackages && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fixedFeePackages[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
