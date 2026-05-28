/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Plus Jakarta Sans", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        cream: "#F5F0E8",
        ink: "#1C1240",
        "ink-2": "#6B7280",
        "ink-3": "#9CA3AF",
        navy: "#130D30",
        "navy-card": "#1E1650",
        brand: "#6C47FF",
        "brand-soft": "#EDE8FF",
        safe: "#22C55E",
        "safe-bg": "#DCFCE7",
        caution: "#F59E0B",
        "caution-bg": "#FEF3C7",
        over: "#EF4444",
        salmon: "#FDE8E4",
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
      },
    },
  },
  plugins: [],
};
