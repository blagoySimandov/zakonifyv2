"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ATTORNEY_DASHBOARD_MESSAGES } from "@/messages";
import { Settings, Clock, Users, DollarSign } from "lucide-react";

interface ConsultationSettings {
  defaultDuration: number;
  bufferTime: number;
  maxConsultationsPerDay: number;
  allowBackToBack: boolean;
  minAdvanceBooking: number;
  maxAdvanceBooking: number;
}

interface ConsultationSettingsConfigProps {
  settings: ConsultationSettings;
  attorney: any;
  isEditing: boolean;
  onChange: (settings: ConsultationSettings) => void;
}

export function ConsultationSettingsConfig({
  settings,
  attorney,
  isEditing,
  onChange,
}: ConsultationSettingsConfigProps) {
  const [hourlyRate, setHourlyRate] = useState(attorney?.hourlyRate || 150);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  
  const updateHourlyRate = useMutation(api.attorneys.updateHourlyRate);
  const handleSettingChange = (field: keyof ConsultationSettings, value: any) => {
    if (!isEditing) return;
    
    onChange({
      ...settings,
      [field]: value,
    });
  };

  const handleHourlyRateChange = async (newRate: number) => {
    if (!isEditing) return;
    
    setHourlyRate(newRate);
    
    // Save to database
    setIsSaving(true);
    try {
      await updateHourlyRate({ hourlyRate: newRate });
      setSaveMessage("Цената е обновена успешно");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Грешка при обновяване на цената");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const SettingCard = ({
    title,
    description,
    icon: Icon,
    children,
  }: {
    title: string;
    description: string;
    icon: any;
    children: React.ReactNode;
  }) => (
    <div className="bg-gray-50 rounded-2xl p-6">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-primary-100 rounded-2xl">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CONSULTATION_SETTINGS.TITLE}
        </h3>
        <p className="text-gray-600 mb-6">
          {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CONSULTATION_SETTINGS.SUBTITLE}
        </p>
      </div>

      {/* Basic Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingCard
          title={ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CONSULTATION_SETTINGS.DEFAULT_DURATION}
          description="Стандартното време за една консултация"
          icon={Clock}
        >
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="15"
              max="240"
              step="15"
              value={settings.defaultDuration}
              onChange={(e) => handleSettingChange("defaultDuration", parseInt(e.target.value))}
              disabled={!isEditing}
              className="w-20 px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
            />
            <span className="text-sm text-gray-600">
              {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CONSULTATION_SETTINGS.MINUTES}
            </span>
          </div>
        </SettingCard>

        <SettingCard
          title={ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CONSULTATION_SETTINGS.BUFFER_TIME}
          description="Време за подготовка между консултации"
          icon={Clock}
        >
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="0"
              max="60"
              step="5"
              value={settings.bufferTime}
              onChange={(e) => handleSettingChange("bufferTime", parseInt(e.target.value))}
              disabled={!isEditing}
              className="w-20 px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
            />
            <span className="text-sm text-gray-600">
              {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CONSULTATION_SETTINGS.MINUTES}
            </span>
          </div>
        </SettingCard>

        <SettingCard
          title={ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CONSULTATION_SETTINGS.MAX_CONSULTATIONS_PER_DAY}
          description="Максимален брой консултации в един ден"
          icon={Users}
        >
          <input
            type="number"
            min="1"
            max="20"
            value={settings.maxConsultationsPerDay}
            onChange={(e) => handleSettingChange("maxConsultationsPerDay", parseInt(e.target.value))}
            disabled={!isEditing}
            className="w-20 px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </SettingCard>

        <SettingCard
          title="Последователни консултации"
          description="Позволи консултации една след друга без пауза"
          icon={Settings}
        >
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.allowBackToBack}
              onChange={(e) => handleSettingChange("allowBackToBack", e.target.checked)}
              disabled={!isEditing}
              className="w-5 h-5 text-primary-600 border-2 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">
              {settings.allowBackToBack ? "Разрешено" : "Не е разрешено"}
            </span>
          </label>
        </SettingCard>
      </div>

      {/* Booking Window Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingCard
          title={ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CONSULTATION_SETTINGS.MIN_ADVANCE_BOOKING}
          description="Минимално време преди консултацията"
          icon={Clock}
        >
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="1"
              max="168"
              value={settings.minAdvanceBooking}
              onChange={(e) => handleSettingChange("minAdvanceBooking", parseInt(e.target.value))}
              disabled={!isEditing}
              className="w-20 px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
            />
            <span className="text-sm text-gray-600">
              {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CONSULTATION_SETTINGS.HOURS}
            </span>
          </div>
        </SettingCard>

        <SettingCard
          title={ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CONSULTATION_SETTINGS.MAX_ADVANCE_BOOKING}
          description="Максимално време напред за резервация"
          icon={Clock}
        >
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="1"
              max="365"
              value={Math.floor(settings.maxAdvanceBooking / 24)}
              onChange={(e) => handleSettingChange("maxAdvanceBooking", parseInt(e.target.value) * 24)}
              disabled={!isEditing}
              className="w-20 px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
            />
            <span className="text-sm text-gray-600">
              {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CONSULTATION_SETTINGS.DAYS}
            </span>
          </div>
        </SettingCard>
      </div>

      {/* Hourly Rate */}
      <SettingCard
        title="Часова ставка"
        description="Вашата цена за час консултация"
        icon={DollarSign}
      >
        <div className="space-y-4">
          {saveMessage && (
            <div className={`text-sm font-medium px-3 py-2 rounded-xl ${saveMessage.includes("успешно") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {saveMessage}
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
              <input
                type="number"
                min="10"
                max="1000"
                step="5"
                value={hourlyRate}
                onChange={(e) => handleHourlyRateChange(parseInt(e.target.value))}
                disabled={!isEditing || isSaving}
                className="w-32 pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <span className="text-sm text-gray-600">на час</span>
            {isSaving && (
              <div className="flex items-center space-x-2 text-primary-600">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Запазване...</span>
              </div>
            )}
          </div>
          
          <p className="text-xs text-gray-500">
            Тази цена ще се използва за всички видове консултации (видео и лични срещи)
          </p>
        </div>
      </SettingCard>
    </div>
  );
}