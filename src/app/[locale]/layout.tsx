import {
  type ReactNode,
} from "react"

import {
  notFound,
} from "next/navigation"

import {
  unstable_setRequestLocale,
} from "next-intl/server"

import Providers from "~/app/[locale]/providers"

const locales = [
  "en",
  "vi",
]

export function generateStaticParams() {
  return locales.map(locale => ({
    locale,
  }))
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale)) {
    locale = "en"
  }

  // Enable static rendering
  unstable_setRequestLocale(locale)

  let messages
  try {
    messages = (await import(`~/locales/${locale}/index`)).default
  }
  catch {
    notFound()
  }

  return (
    <Providers
      locale={locale}
      messages={messages}
    >
      {children}
    </Providers>
  )
}
