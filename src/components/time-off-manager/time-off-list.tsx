"use client";

import { TimeOffPeriod } from "@/types/availability";
import { TIME_OFF_CONSTANTS } from "./constants";
import { Edit, Trash2, Clock } from "lucide-react";

interface TimeOffListProps {
  timeOffPeriods: TimeOffPeriod[];
  onEdit: (timeOff: TimeOffPeriod) => void;
  onDelete: (id: string) => void;
}

export function TimeOffList({ timeOffPeriods, onEdit, onDelete }: TimeOffListProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTypeColor = (type: string) => {
    const typeOption = TIME_OFF_CONSTANTS.TYPE_OPTIONS.find(option => option.value === type);
    return typeOption?.color || 'bg-gray-100 text-gray-800';
  };

  const renderTimeOffItem = (period: TimeOffPeriod) => (
    <div key={period.id} className="p-4 border-b border-gray-200 hover:bg-gray-50">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium text-gray-900">{period.title}</h4>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getTypeColor(period.type)}`}>
            {TIME_OFF_CONSTANTS.TYPE_OPTIONS.find(opt => opt.value === period.type)?.label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(period)}
            className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => period.id && onDelete(period.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="w-4 h-4" />
        <span>
          {formatDate(period.startTime)} - {formatDate(period.endTime)}
        </span>
      </div>
      
      {period.reason && (
        <p className="text-sm text-gray-500 mt-2">{period.reason}</p>
      )}
    </div>
  );

  return (
    <div className="h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {TIME_OFF_CONSTANTS.LIST.TITLE}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {timeOffPeriods.length} scheduled periods
        </p>
      </div>
      
      <div className="overflow-y-auto">
        {timeOffPeriods.length > 0 ? (
          timeOffPeriods.map(renderTimeOffItem)
        ) : (
          <div className="p-8 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {TIME_OFF_CONSTANTS.LIST.NO_PERIODS}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}