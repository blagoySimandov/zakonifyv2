export const APP_NAME = "Zakonify V2";
export const APP_DESCRIPTION =
  "Modern Next.js application with tRPC and Convex";

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const API_ROUTES = {
  TRPC: "/api/trpc",
} as const;

// Mock current attorney id for dashboard development
export const MOCK_ATTORNEY_ID = "j57ee1tx3k7xgaw35vyqptkybn7n49te" as const;
