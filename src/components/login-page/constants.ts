export const LOGIN_TYPES = {
  CLIENT: "client",
  ATTORNEY: "attorney",
} as const;

export type LoginType = (typeof LOGIN_TYPES)[keyof typeof LOGIN_TYPES];