"use client";

import { useState } from "react";
import { Users, Scale, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui";
import { LOGIN_MESSAGES } from "./messages";
import { USER_TYPES } from "./constants";
import { useLoginPage } from "./hooks";
import { LoginNavbar } from "./login-navbar";

export function LoginPage() {
  const { handleLogin } = useLoginPage();
  const [selectedUserType, setSelectedUserType] = useState<keyof typeof USER_TYPES | string>(USER_TYPES.ATTORNEY);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(selectedUserType as any);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Login Navbar */}
      <LoginNavbar />
      
      {/* Solid background */}
      <div className="absolute inset-0 bg-legal-700">
        <div className="absolute w-80 h-80 bg-white/10 rounded-full -top-20 -right-20 animate-pulse"></div>
        <div className="absolute w-60 h-60 bg-white/10 rounded-full -bottom-10 -left-10 animate-pulse delay-1000"></div>
      </div>

      {/* Login container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-5">
        <div className="bg-white/98 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-10 animate-in slide-in-from-bottom-4 duration-500">
          {/* Logo section */}
          <div className="text-center mb-8">
            <div className="w-15 h-15 mx-auto mb-4 bg-legal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-legal-600 mb-1">
              {LOGIN_MESSAGES.PAGE_TITLE}
            </h1>
            <p className="text-sm text-gray-600">
              {LOGIN_MESSAGES.PAGE_SUBTITLE}
            </p>
          </div>

          {/* User type toggle */}
          <div className="relative bg-gray-100 rounded-xl p-1 mb-8 flex">
            <div 
              className={`absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-legal-600 rounded-lg transition-transform duration-300 shadow-md ${
                selectedUserType === USER_TYPES.CLIENT ? "translate-x-full" : ""
              }`}
            />
            <button
              type="button"
              className={`relative z-10 flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${
                selectedUserType === USER_TYPES.ATTORNEY ? "text-white" : "text-gray-600"
              }`}
              onClick={() => setSelectedUserType(USER_TYPES.ATTORNEY)}
            >
              <Scale className="w-4 h-4" />
              {LOGIN_MESSAGES.ATTORNEY_LOGIN_TITLE}
            </button>
            <button
              type="button"
              className={`relative z-10 flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${
                selectedUserType === USER_TYPES.CLIENT ? "text-white" : "text-gray-600"
              }`}
              onClick={() => setSelectedUserType(USER_TYPES.CLIENT)}
            >
              <Users className="w-4 h-4" />
              {LOGIN_MESSAGES.CLIENT_LOGIN_TITLE}
            </button>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {LOGIN_MESSAGES.EMAIL_LABEL}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:border-legal-600 focus:ring-0 focus:outline-none transition-colors duration-300 bg-white"
                  placeholder={LOGIN_MESSAGES.EMAIL_PLACEHOLDER}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {LOGIN_MESSAGES.PASSWORD_LABEL}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:border-legal-600 focus:ring-0 focus:outline-none transition-colors duration-300 bg-white"
                  placeholder={LOGIN_MESSAGES.PASSWORD_PLACEHOLDER}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                  className="w-4 h-4 text-legal-600 border-gray-300 rounded focus:ring-legal-600"
                />
                <span className="text-sm text-gray-600">
                  {LOGIN_MESSAGES.REMEMBER_ME}
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-legal-600 hover:text-legal-700 font-semibold transition-colors duration-300"
              >
                {LOGIN_MESSAGES.FORGOT_PASSWORD}
              </button>
            </div>

            <Button 
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-4 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {LOGIN_MESSAGES.SIGN_IN_BUTTON}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">
                {LOGIN_MESSAGES.OR_DIVIDER}
              </span>
            </div>
          </div>

          {/* Google sign in */}
          <button
            type="button"
            className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {LOGIN_MESSAGES.GOOGLE_SIGN_IN}
          </button>

          {/* Sign up link */}
          <div className="text-center mt-6">
            <span className="text-sm text-gray-600">
              {LOGIN_MESSAGES.NO_ACCOUNT}{" "}
              <button 
                type="button"
                className="text-legal-600 hover:text-legal-700 font-semibold transition-colors duration-300"
              >
                {LOGIN_MESSAGES.SIGN_UP}
              </button>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}