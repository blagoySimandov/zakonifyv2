"use client";

import Link from "next/link";
import { useNavbarState } from "./hooks";
import { NAVBAR_CONSTANTS } from "./constants";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useNavbarState();

  const renderBrandLogo = () => (
    <Link
      href="/"
      className="text-2xl font-bold text-blue-500 hover:text-blue-600 transition-colors"
      onClick={closeMobileMenu}
    >
      {NAVBAR_CONSTANTS.BRAND_NAME}
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
    <div className="hidden md:flex items-center space-x-8">
      {NAVBAR_CONSTANTS.NAVIGATION_ITEMS.map((navigationItem) => (
        <Link
          key={navigationItem.href}
          href={navigationItem.href}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          {navigationItem.label}
        </Link>
      ))}
    </div>
  );

  const renderActionButtons = () => (
    <div className="hidden md:flex items-center space-x-4">
      <Link
        href="/register"
        className="text-blue-500 hover:text-blue-600 transition-colors"
      >
        {NAVBAR_CONSTANTS.ACTIONS.JOIN_AS_ATTORNEY}
      </Link>
      <Link
        href="/login"
        className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        {NAVBAR_CONSTANTS.ACTIONS.LOGIN}
      </Link>
      <Link
        href="/signup"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {NAVBAR_CONSTANTS.ACTIONS.SIGN_UP}
      </Link>
    </div>
  );

  const renderMobileMenu = () => (
    <div
      className={`md:hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
    >
      <div className="px-6 py-4 space-y-4 bg-gray-50 border-t">
        {NAVBAR_CONSTANTS.NAVIGATION_ITEMS.map((navigationItem) => (
          <Link
            key={navigationItem.href}
            href={navigationItem.href}
            className="block text-gray-600 hover:text-gray-900 transition-colors"
            onClick={closeMobileMenu}
          >
            {navigationItem.label}
          </Link>
        ))}

        <div className="pt-4 border-t border-gray-200 space-y-3">
          <Link
            href="/register"
            className="block text-blue-500 hover:text-blue-600 transition-colors"
            onClick={closeMobileMenu}
          >
            {NAVBAR_CONSTANTS.ACTIONS.JOIN_AS_ATTORNEY}
          </Link>
          <Link
            href="/login"
            className="block text-gray-600 hover:text-gray-900 transition-colors"
            onClick={closeMobileMenu}
          >
            {NAVBAR_CONSTANTS.ACTIONS.LOGIN}
          </Link>
          <Link
            href="/signup"
            className="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={closeMobileMenu}
          >
            {NAVBAR_CONSTANTS.ACTIONS.SIGN_UP}
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {renderBrandLogo()}
          {renderNavigationLinks()}
          {renderActionButtons()}
          {renderMobileMenuToggle()}
        </div>
      </div>
      {renderMobileMenu()}
    </nav>
  );
}
