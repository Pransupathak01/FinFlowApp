/**
 * Type declarations for .env variables imported via @env.
 * Add new variables here whenever .env is updated.
 */
declare module '@env' {
  export const API_URL: string;
  export const SOCKET_URL: string;
  export const RAZORPAY_KEY_ID: string;
  export const RAZORPAY_KEY_SECRET: string;
}
