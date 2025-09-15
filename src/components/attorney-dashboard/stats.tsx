"use client";

import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { ATTORNEY_DASHBOARD_MESSAGES } from "@/messages";

interface DashboardStatsProps {
  consultations: any[];
  availabilityProfile: any;
}

export function DashboardStats({ 
  consultations, 
  availabilityProfile 
}: DashboardStatsProps) {
  const totalConsultations = consultations.length;
  const upcomingConsultations = consultations.filter(c => 
    c.scheduledAt > Date.now() && c.status !== "cancelled"
  ).length;
  

  const totalRevenue = consultations
    .filter(c => c.status === "completed")
    .reduce((sum, c) => sum + (c.price || 0), 0);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    trend,
    color = "primary"
  }: {
    title: string;
    value: string | number;
    icon: any;
    change?: string;
    trend?: "up" | "down";
    color?: "primary" | "green" | "blue" | "orange" | "red";
  }) => {
    const colorClasses = {
      primary: "bg-primary-50 border-primary-200 text-primary-700",
      green: "bg-green-50 border-green-200 text-green-700", 
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      orange: "bg-orange-50 border-orange-200 text-orange-700",
      red: "bg-red-50 border-red-200 text-red-700",
    };

    const iconColorClasses = {
      primary: "text-primary-600",
      green: "text-green-600",
      blue: "text-blue-600", 
      orange: "text-orange-600",
      red: "text-red-600",
    };

    return (
      <div className={`bg-white rounded-3xl border-2 ${colorClasses[color]} p-6 relative overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/20 rounded-full"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              {title}
            </h3>
            <div className={`p-3 rounded-2xl bg-white/50`}>
              <Icon className={`w-6 h-6 ${iconColorClasses[color]}`} />
            </div>
          </div>
          
          <div className="mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {value}
            </span>
          </div>
          
          {change && (
            <div className={`flex items-center space-x-1 text-sm ${
              trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
            }`}>
              {trend && (
                <TrendingUp className={`w-4 h-4 ${
                  trend === "down" ? "rotate-180" : ""
                }`} />
              )}
              <span className="font-medium">{change}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const QuickActionCard = ({
    title,
    description, 
    icon: Icon,
    onClick,
  }: {
    title: string;
    description: string;
    icon: any;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-primary-50 rounded-2xl">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );

  const isProfileActive = availabilityProfile?.isActive;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={ATTORNEY_DASHBOARD_MESSAGES.STATS.TOTAL_CONSULTATIONS}
          value={totalConsultations}
          icon={Calendar}
          color="primary"
        />
        
        <StatCard
          title={ATTORNEY_DASHBOARD_MESSAGES.STATS.UPCOMING_CONSULTATIONS}
          value={upcomingConsultations}
          icon={Clock}
          color="blue"
        />
        
        <StatCard
          title={ATTORNEY_DASHBOARD_MESSAGES.STATS.REVENUE}
          value={`€${totalRevenue}`}
          icon={DollarSign}
          color="green"
        />
        
        <StatCard
          title={ATTORNEY_DASHBOARD_MESSAGES.STATS.AVAILABILITY_STATUS}
          value={isProfileActive ? "Активен" : "Неактивен"}
          icon={isProfileActive ? CheckCircle : AlertCircle}
          color={isProfileActive ? "green" : "red"}
        />
      </div>

      {/* Availability Status Banner */}
      {!isProfileActive && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-amber-100 rounded-2xl">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-2">
                {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.NO_PROFILE_TITLE}
              </h3>
              <p className="text-amber-800 mb-4">
                {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.NO_PROFILE_DESCRIPTION}
              </p>
              <button className="px-6 py-3 bg-amber-600 text-white rounded-2xl hover:bg-amber-700 transition-colors font-medium">
                {ATTORNEY_DASHBOARD_MESSAGES.AVAILABILITY_PROFILE.CREATE_PROFILE}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {ATTORNEY_DASHBOARD_MESSAGES.QUICK_ACTIONS.TITLE}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickActionCard
            title={ATTORNEY_DASHBOARD_MESSAGES.QUICK_ACTIONS.VIEW_CALENDAR}
            description="Разгледайте календара си и управлявайте срещите"
            icon={Calendar}
            onClick={() => {}}
          />
          
          <QuickActionCard
            title={ATTORNEY_DASHBOARD_MESSAGES.QUICK_ACTIONS.MANAGE_CLIENTS} 
            description="Управлявайте клиенти и техните казуси"
            icon={Users}
            onClick={() => {}}
          />
          
          <QuickActionCard
            title={ATTORNEY_DASHBOARD_MESSAGES.QUICK_ACTIONS.UPDATE_PROFILE}
            description="Обновете информацията в профила си"
            icon={Users}
            onClick={() => {}}
          />
          
          <QuickActionCard
            title={ATTORNEY_DASHBOARD_MESSAGES.QUICK_ACTIONS.VIEW_REPORTS}
            description="Прегледайте отчети за дейността си" 
            icon={TrendingUp}
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}