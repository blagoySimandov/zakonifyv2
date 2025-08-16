"use client";

import React, { forwardRef } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helpText?: string;
  isLoading?: boolean;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    success, 
    helpText, 
    isLoading, 
    required = false, 
    className = "", 
    ...props 
  }, ref) => {
    const inputId = props.id || props.name;
    const hasError = Boolean(error);
    const hasSuccess = success && !hasError && !isLoading;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-gray-900">
            {label}
            {required && " *"}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`w-full px-4 py-4 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
              hasError
                ? "border-danger-300 bg-danger-50 focus:ring-danger-500"
                : "border-gray-200 hover:border-gray-300 focus:bg-white"
            } ${className}`}
            aria-describedby={
              error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
            }
            {...props}
          />
          
          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {hasSuccess && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <CheckCircle className="w-5 h-5 text-success-500" />
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-danger-500 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p id={`${inputId}-help`} className="text-gray-500 text-sm">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label, 
    error, 
    helpText, 
    required = false, 
    className = "", 
    ...props 
  }, ref) => {
    const inputId = props.id || props.name;
    const hasError = Boolean(error);

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-gray-900">
            {label}
            {required && " *"}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-4 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none ${
            hasError
              ? "border-danger-300 bg-danger-50 focus:ring-danger-500"
              : "border-gray-200 hover:border-gray-300 focus:bg-white"
          } ${className}`}
          aria-describedby={
            error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
          }
          {...props}
        />

        {error && (
          <p id={`${inputId}-error`} className="text-danger-500 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p id={`${inputId}-help`} className="text-gray-500 text-sm">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";