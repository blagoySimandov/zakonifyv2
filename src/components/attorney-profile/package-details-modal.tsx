"use client";

import { X } from "lucide-react";
import { ATTORNEY_PROFILE_MESSAGES } from "@/messages";

interface PackageDetailsModalProps {
  package: {
    name: string;
    description: string;
    price: number;
  };
  onClose: () => void;
}

export function PackageDetailsModal({ package: pkg, onClose }: PackageDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {pkg.name}
              </h2>
              <div className="text-3xl font-bold text-primary-600">
                €{pkg.price}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {ATTORNEY_PROFILE_MESSAGES.INFO.FIXED_FEE}
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          
          <div className="prose prose-gray max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {pkg.description}
            </div>
          </div>
          
          <div className="mt-8 flex gap-4">
            <button className="flex-1 px-6 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-700/30 transform hover:-translate-y-0.5">
              {ATTORNEY_PROFILE_MESSAGES.ACTIONS.BOOK_CONSULTATION}
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-semibold"
            >
              Затвори
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}