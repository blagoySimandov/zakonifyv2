"use client";

import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  className?: string;
}

export function ErrorAlert({ message, className = "" }: ErrorAlertProps) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
        <p className="text-red-700 font-medium">{message}</p>
      </div>
    </div>
  );
}