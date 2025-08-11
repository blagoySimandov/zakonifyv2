"use client";

import Link from "next/link";
import { useNavbarState } from "./hooks";
import { NAVBAR_CONSTANTS } from "./constants";
import { NAVBAR_MESSAGES } from "./messages";
import { Menu, X, Bell } from "lucide-react";

export function Navbar() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useNavbarState();

  const renderBrandLogo = () => (
    <Link
      href="/"
      className="text-2xl font-bold text-gray-900 hover:text-teal-600 transition-colors"
      onClick={closeMobileMenu}
    >
      {NAVBAR_MESSAGES.BRAND_NAME}
    </Link>
  );

  const renderMobileMenuToggle = () => (
    <button
      onClick={toggleMobileMenu}
      className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      aria-label="Toggle mobile menu"
    >
      {isMobileMenuOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <Menu className="w-6 h-6" />
      )}
    </button>
  );

  const renderNavigationLinks = () => (
    <nav className="hidden md:flex items-center space-x-6">
      {NAVBAR_CONSTANTS.NAVIGATION_ITEMS.map((navigationItem) => (
        <Link
          key={navigationItem.href}
          href={navigationItem.href}
          className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
        >
          {NAVBAR_MESSAGES.NAVIGATION[navigationItem.label as keyof typeof NAVBAR_MESSAGES.NAVIGATION]}
        </Link>
      ))}
    </nav>
  );

  const renderUserSection = () => (
    <div className="hidden md:flex items-center space-x-4">
      <button 
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label={NAVBAR_MESSAGES.ACTIONS.NOTIFICATIONS}
      >
        <Bell className="w-5 h-5" />
      </button>
      <div className={`w-8 h-8 ${NAVBAR_CONSTANTS.USER_AVATAR_COLOR} rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:opacity-80 transition-opacity`}>
        {NAVBAR_CONSTANTS.AVATAR_INITIAL}
      </div>
    </div>
  );

  const renderMobileMenu = () => (
    <div
      className={`md:hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
    >
      <div className="px-6 py-4 space-y-4 bg-gray-50 border-t border-gray-100">
        {NAVBAR_CONSTANTS.NAVIGATION_ITEMS.map((navigationItem) => (
          <Link
            key={navigationItem.href}
            href={navigationItem.href}
            className="block text-gray-600 hover:text-gray-900 transition-colors"
            onClick={closeMobileMenu}
          >
            {NAVBAR_MESSAGES.NAVIGATION[navigationItem.label as keyof typeof NAVBAR_MESSAGES.NAVIGATION]}
          </Link>
        ))}

        <div className="pt-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 ${NAVBAR_CONSTANTS.USER_AVATAR_COLOR} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
              {NAVBAR_CONSTANTS.AVATAR_INITIAL}
            </div>
            <span className="text-gray-900 font-medium">{NAVBAR_MESSAGES.ACTIONS.PROFILE}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {renderBrandLogo()}
          {renderNavigationLinks()}
          {renderUserSection()}
          {renderMobileMenuToggle()}
        </div>
      </div>
      {renderMobileMenu()}
    </nav>
  );
}
