/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      colors: {
        canvas: "#0f0f0f",
        surface: "#161616",
        border: "#2a2a2a",
        accent: "#7ca48d",
        "accent-light": "#a8c5b5",
        muted: "#6b6b6b",
        faint: "#2e2e2e",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "cursor-blink": "blink 1s step-end infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
