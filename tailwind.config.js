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
        cream: "#F7F9FC",
        ink: "#101828",
        "ink-2": "#667085",
        "ink-3": "#98A2B3",
        navy: "#07111F",
        "navy-card": "#111C2E",
        brand: "#2563EB",
        "brand-soft": "#DBEAFE",
        safe: "#16A34A",
        "safe-bg": "#DCFCE7",
        caution: "#F59E0B",
        "caution-bg": "#FEF3C7",
        over: "#EF4444",
        salmon: "#FFE4E6",
      },
      borderRadius: {
        card: "22px",
        btn: "18px",
      },
      boxShadow: {
        soft: "0 18px 40px rgba(15, 23, 42, 0.08)",
        lift: "0 24px 60px rgba(15, 23, 42, 0.14)",
        brand: "0 18px 36px rgba(37, 99, 235, 0.24)",
      },
    },
  },
  plugins: [],
};
