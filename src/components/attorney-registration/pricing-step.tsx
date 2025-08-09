"use client";

import { AttorneyRegistrationFormData } from "./validation";
import { REGISTRATION_CONSTANTS } from "./constants";
import { REGISTRATION_MESSAGES } from "./messages";
import { Plus, Package, Trash2 } from "lucide-react";

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
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {REGISTRATION_CONSTANTS.STEP_TITLES.pricing}
        </h2>
        <p className="text-gray-600 mb-6">
          {REGISTRATION_CONSTANTS.STEP_DESCRIPTIONS.pricing}
        </p>
      </div>

      <div className="space-y-6">
        {/* Hourly Rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {REGISTRATION_CONSTANTS.LABELS.HOURLY_RATE} *
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <span className="text-gray-500 text-sm font-medium">лв</span>
            </div>
            <input
              type="number"
              min="50"
              max="2000"
              value={formData.hourlyRate || ""}
              onChange={(e) =>
                updateFormData({ hourlyRate: Number(e.target.value) })
              }
              placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.HOURLY_RATE}
              className={`w-full pl-12 pr-16 py-4 border rounded-xl text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.hourlyRate
                  ? "border-red-300 bg-red-50 focus:ring-red-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
              /час
            </div>
          </div>
          {errors.hourlyRate && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
              <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              </span>
              {errors.hourlyRate[0]}
            </p>
          )}
          <p className="text-gray-500 text-sm mt-2">
            {REGISTRATION_MESSAGES.HELP.HOURLY_RATE}
          </p>
        </div>

        {/* Fixed Fee Packages */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                {REGISTRATION_CONSTANTS.LABELS.FIXED_PACKAGES}
              </label>
              <p className="text-gray-500 text-sm">
                {REGISTRATION_MESSAGES.HELP.PACKAGES}
              </p>
            </div>
            <button
              type="button"
              onClick={addFixedFeePackage}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md">
              <Plus className="w-4 h-4" />
              {REGISTRATION_CONSTANTS.BUTTONS.ADD_PACKAGE}
            </button>
          </div>

          {packages.length === 0 ? (
            <div className="relative">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Няма добавени пакети
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                  Добавете пакети с фиксирана цена, за да предложите на клиентите си различни опции за услуги
                </p>
                <button
                  type="button"
                  onClick={addFixedFeePackage}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm">
                  <Plus className="w-4 h-4" />
                  Добави първия пакет
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
                  <div className="absolute top-6 right-6">
                    <button
                      type="button"
                      onClick={() => removeFixedFeePackage(index)}
                      className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Пакет #{index + 1}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Персонализиран пакет услуги
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Име на пакета
                      </label>
                      <input
                        type="text"
                        value={pkg.name || ""}
                        onChange={(e) =>
                          updateFixedFeePackage(index, { name: e.target.value })
                        }
                        placeholder={
                          REGISTRATION_CONSTANTS.PLACEHOLDERS.PACKAGE_NAME
                        }
                        className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 hover:border-gray-300 ${
                          errors[`fixedFeePackages.${index}.name`]
                            ? "border-red-300 bg-red-50 focus:ring-red-500"
                            : "border-gray-200 focus:ring-blue-500"
                        }`}
                      />
                      {errors[`fixedFeePackages.${index}.name`] && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-2">
                          <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          </span>
                          {errors[`fixedFeePackages.${index}.name`][0]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Описание на услугите
                      </label>
                      <textarea
                        rows={3}
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
                        className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none hover:border-gray-300 ${
                          errors[`fixedFeePackages.${index}.description`]
                            ? "border-red-300 bg-red-50 focus:ring-red-500"
                            : "border-gray-200 focus:ring-blue-500"
                        }`}
                      />
                      {errors[`fixedFeePackages.${index}.description`] && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-2">
                          <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          </span>
                          {errors[`fixedFeePackages.${index}.description`][0]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Цена на пакета
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                          <span className="text-gray-500 text-sm font-medium">лв</span>
                        </div>
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
                          className={`w-full pl-12 pr-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 hover:border-gray-300 ${
                            errors[`fixedFeePackages.${index}.price`]
                              ? "border-red-300 bg-red-50 focus:ring-red-500"
                              : "border-gray-200 focus:ring-blue-500"
                          }`}
                        />
                      </div>
                      {errors[`fixedFeePackages.${index}.price`] && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-2">
                          <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          </span>
                          {errors[`fixedFeePackages.${index}.price`][0]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {errors.fixedFeePackages && (
            <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
              <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              </span>
              {errors.fixedFeePackages[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
