
export const API_URL =
process.env.NODE_ENV === "development"
  ? process.env.NEXT_PUBLIC_API_URL
  : process.env.NEXT_PUBLIC_API_URL; // Use environment variable in production
