import type {
  Config,
} from "tailwindcss"

export default {
  content: ["./src/**/*.tsx"],
  darkMode: ["class"],
  theme: {
    extend: {
      screens: {
        sm: "30rem",
        md: "48rem",
        lg: "60rem",
        xl: "90rem",
      },
      fontFamily: {
      },
      fontSize: {
        "2xs": "0.625rem",
        "xs": "0.75rem",
        "2xl": "3rem",
      },
      colors: {
        "primary": {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        "success": {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        "error": {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        "warning": {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        "destructive": "hsl(var(--destructive))",
        "background": "hsl(var(--background))",
        "foreground": "hsl(var(--foreground))",
        "accent": {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        "pending": "hsl(var(--pending))",
        "processing": "hsl(var(--processing))",
        "approved": "hsl(var(--approved))",
        "partial-paid": "hsl(var(--partial-paid))",
        "paid": "hsl(var(--paid))",
        "completed": "hsl(var(--completed))",
        "cancelled": "hsl(var(--cancelled))",
        "order-error": "hsl(var(--order-error))",
        "refunded": "hsl(var(--refunded))",

        "sidebar": {
          "DEFAULT": "hsl(var(--sidebar-background))",
          "foreground": "hsl(var(--sidebar-foreground))",
          "primary": "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          "accent": "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          "border": "hsl(var(--sidebar-border))",
          "ring": "hsl(var(--sidebar-ring))",
        },
      },
    },
  },
  plugins: [],
} satisfies Config
