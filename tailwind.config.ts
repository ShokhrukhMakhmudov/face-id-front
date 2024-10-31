import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["bumblebee"],
          "--background": "#eee",

          "primary-content": "#000",
          primary: "#2563eb",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "primary-content": "#fff",
          primary: "#2563eb",
        },
      },
    ],
  },
};
export default config;
