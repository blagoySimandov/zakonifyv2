export const COLORS = {
  // Primary brand colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb", // Main primary color
    700: "#1d4ed8", // Darker primary for hover states
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },

  // Legal/Professional blue (current theme)
  legal: {
    50: "#f0f7ff",
    100: "#e0f0fe",
    200: "#bae1fd",
    300: "#7cc8fc",
    400: "#36adf8",
    500: "#0c95e9",
    600: "#2563eb", // Main legal blue (blue-600)
    700: "#1d4ed8", // Darker legal blue (blue-700)
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Success colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a", // Main success color
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // Error/Danger colors
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626", // Main danger color
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Warning colors
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Neutral/Gray colors
  neutral: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563", // Main text color
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },

  // Semantic colors for specific use cases
  semantic: {
    // Backgrounds
    background: "#ffffff",
    backgroundAlt: "#f9fafb",

    // Text
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    textTertiary: "#9ca3af",

    // Borders
    border: "#e5e7eb",
    borderLight: "#f3f4f6",

    // Interactive states
    hover: "#f3f4f6",
    focus: "#dbeafe",

    // Overlays
    overlay: "rgba(0, 0, 0, 0.5)",
    overlayLight: "rgba(0, 0, 0, 0.25)",
  },
} as const;

// Color utility functions
export const getColorValue = (colorPath: string): string => {
  const keys = colorPath.split(".");
  let current = COLORS as Record<string, unknown>;

  for (const key of keys) {
    if (typeof current === "object" && current !== null && key in current) {
      current = current[key] as Record<string, unknown>;
    } else {
      return colorPath;
    }
  }

  return typeof current === "string" ? current : colorPath;
};

// Gradient utilities using our brand colors
export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.legal[600]}, ${COLORS.legal[700]})`,
  primaryReverse: `linear-gradient(135deg, ${COLORS.legal[700]}, ${COLORS.legal[600]})`,
  background: `linear-gradient(135deg, ${COLORS.legal[600]} 0%, ${COLORS.legal[700]} 50%, ${COLORS.legal[800]} 100%)`,
  success: `linear-gradient(135deg, ${COLORS.success[600]}, ${COLORS.success[700]})`,
  danger: `linear-gradient(135deg, ${COLORS.danger[600]}, ${COLORS.danger[700]})`,
} as const;

// Export commonly used colors for quick access
export const BRAND_COLORS = {
  primary: COLORS.legal[600],
  primaryHover: COLORS.legal[700],
  primaryDark: COLORS.legal[800],
  success: COLORS.success[600],
  danger: COLORS.danger[600],
  warning: COLORS.warning[600],
  text: COLORS.neutral[600],
  textDark: COLORS.neutral[900],
  border: COLORS.neutral[200],
  background: COLORS.semantic.background,
} as const;

