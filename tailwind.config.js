/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ matchUtilities }) {
      matchUtilities({
        "debug-outline": (color) => {
          return {
            outlineStyle: "solid",
            outlineWidth: "4px",
            outlineColor: color,
          };
        },
      });
    }),
  ],
};
