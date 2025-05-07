"use client"

import React from "react"

import {
  QueryClientProvider,
} from "@tanstack/react-query"
import {
  setDefaultOptions,
} from "date-fns"
import {
  enUS,
} from "date-fns/locale"
import {
  CircleAlert, CircleCheck, CircleX, Info, Loader,
} from "lucide-react"
import {
  SessionProvider,
} from "next-auth/react"
import {
  ThemeProvider as NextThemesProvider,
} from "next-themes"

import {
  getQueryClient,
} from "~/lib/tanstack-query/get-query-client"
import {
  GlobalConfirmAlert,
} from "~/shared/components/dialogs/global-confirm-alert"
import {
  Toaster,
} from "~/shared/components/ui/sonner"

export default function Providers({ children }: Readonly<{
  children: React.ReactNode
}>) {
  const queryClient = getQueryClient()

  React.useEffect(
    () => {
      setDefaultOptions({
        locale: enUS,
      })
    }, []
  )

  return (
    <QueryClientProvider
      client={queryClient}
    >
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange={false}
      >
        <SessionProvider>
          {children}
        </SessionProvider>

        <Toaster
          icons={
            {
              success: <CircleCheck className="text-success size-4" />,
              info: <Info className="text-info size-4" />,
              warning: <CircleAlert className="text-warning size-4" />,
              error: <CircleX className="text-error size-4" />,
              loading: <Loader className="animate-spin size-4" />,
            }
          }
        />

        <GlobalConfirmAlert />
      </NextThemesProvider>
    </QueryClientProvider>
  )
}
