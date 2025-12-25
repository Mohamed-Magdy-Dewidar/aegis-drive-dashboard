/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0f172a",    // Deep Blue-Black Background
          surface: "#1e293b", // Lighter Panels
          primary: "#3b82f6", // Action Blue
          danger: "#ef4444",  // Red for Alerts
          success: "#10b981", // Green for Online
          warning: "#f59e0b", // Orange for Warnings
        }
      }
    },
  },
  plugins: [],
}