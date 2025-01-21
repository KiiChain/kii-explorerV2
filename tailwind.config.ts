import defaultTheme from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "hsl(var(--sidebar-border))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          ring: "hsl(var(--sidebar-ring))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        "2xs": ["0.625rem", "0.8125rem"],
        xs: ["0.625rem", "1.25rem"],
        sm: ["0.75rem", "1.25rem"],
        base: ["0.875rem", "1.25rem"],
        lg: ["1.5rem", "1.25rem"],
        xl: ["1.75rem", "1.25rem"],
        "2xl": ["2rem", "1.5rem"],
        "3xl": ["2.25rem", "1.75rem"],
        "4xl": ["2.5rem", "2rem"],
      },
    },
  },
  plugins: [],
};

export default config;
