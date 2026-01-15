import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

import svgToDataUri from "mini-svg-data-uri";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: "class", // Define que o modo escuro é ativado pela classe 'dark'
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addBase, matchUtilities, theme }) {
      // 1. Gera variáveis CSS globais de cores
      const allColors = flattenColorPalette(theme("colors"));
      const newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [
          `--${key}`,
          val as string,
        ]),
      );
      addBase({ ":root": newVars });

      // 2. Cria os utilitários de Grid (bg-grid, bg-dot, etc)
      matchUtilities(
        {
          "bg-grid": (value: string) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          "bg-grid-small": (value: string) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H7.5V8"/></svg>`,
            )}")`,
          }),
          "bg-dot": (value: string) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
            )}")`,
          }),
        },
        {
          values: flattenColorPalette(theme("backgroundColor")),
          type: "color",
        },
      );
    }),
  ],
};

export default config;
