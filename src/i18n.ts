/* eslint-disable no-restricted-syntax */
import {
  createSharedPathnamesNavigation,
} from "next-intl/navigation"

// Define locales and paths
export const locales = [
  "en",
  "vi",
]
export const defaultLocale = "vi"

// Create navigation functions that handle locale detection
export const {
  Link, redirect, usePathname, useRouter,
} = createSharedPathnamesNavigation({
  locales,
  localePrefix: "as-needed",
})

// lib/i18n.ts
export async function getTranslation(locale: string) {
  const translations = await import(`~/locales/${locale}/meta.json`)
  return (key: string) => {
    const keys = key.split(".")
    let result: any = translations.default

    for (const k of keys) {
      result = result?.[k]
      if (!result) break
    }

    return result || key // fallback về key nếu không có
  }
}
