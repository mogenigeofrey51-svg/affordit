/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Sora", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        cream: "#F8F2E8",
        ink: "#081225",
        "ink-2": "#6F7685",
        "ink-3": "#98A2B3",
        navy: "#07111F",
        "navy-card": "#101827",
        brand: "#7C5CFC",
        "brand-soft": "#EEE9FF",
        safe: "#06A77D",
        "safe-bg": "#DDF8EF",
        caution: "#FFB23E",
        "caution-bg": "#FFF2D8",
        over: "#FF5C5C",
        salmon: "#FFEAE7",
      },
      borderRadius: {
        card: "28px",
        btn: "20px",
      },
      boxShadow: {
        soft: "0 18px 40px rgba(8, 18, 37, 0.08)",
        lift: "0 24px 60px rgba(8, 18, 37, 0.14)",
        brand: "0 18px 36px rgba(124, 92, 252, 0.24)",
      },
    },
  },
  plugins: [],
};