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
        bg: "#0E1117",
        surface: "#181C24",
        "surface-2": "#222732",
        border: "#2C323D",
        text: "#F4F6FA",
        muted: "#9AA3B2",
        brand: "#7C5CFC",
        "brand-soft": "#2A2350",
        safe: "#2FD08A",
        caution: "#FFB23E",
        over: "#FF5C5C",
      },
      borderRadius: {
        card: "16px",
        btn: "14px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.35), 0 1px 2px -1px rgba(0,0,0,0.35)",
        hero: "0 0 40px 8px rgba(124,92,252,0.18)",
        "hero-safe": "0 0 40px 8px rgba(47,208,138,0.18)",
        "hero-caution": "0 0 40px 8px rgba(255,178,62,0.18)",
        "hero-over": "0 0 40px 8px rgba(255,92,92,0.18)",
      },
    },
  },
  plugins: [],
};
