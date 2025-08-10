export const NAVBAR_CONSTANTS = {
  BRAND_NAME: "Zakonify",
  NAVIGATION_ITEMS: [
    { label: "Find Attorneys", href: "/attorneys" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "About", href: "/about" },
  ],
  ACTIONS: {
    JOIN_AS_ATTORNEY: "Join as Attorney",
    LOGIN: "Login",
    SIGN_UP: "Sign Up",
  },
} as const;
