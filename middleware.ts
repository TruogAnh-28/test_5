// middleware.ts
import createMiddleware from "next-intl/middleware"

export default createMiddleware({
  // Supported locales
  locales: [
    "en",
    "vi",
  ],

  // Default locale
  defaultLocale: "en",

  // Other options
  localePrefix: "as-needed",
})

export const config = {
  // Apply middleware to all pages
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}
