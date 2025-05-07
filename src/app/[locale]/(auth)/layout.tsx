import {
  type ReactNode,
} from "react"

import {
  Logo,
} from "~/shared/components/shared/logo"

export default async function AuthLayout({ children }: Readonly<{
  children: ReactNode
}>) {
  return (
    <div
      className="flex h-screen flex-col"
    >
      <main
        className="bg-background flex flex-col items-center justify-center size-full"
      >
        <div className="md:grid grid-cols-[1fr_2fr] items-center gap-24">
          <Logo />

          {children}

        </div>
      </main>
    </div>
  )
}
