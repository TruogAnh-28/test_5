import {
  type ReactNode,
} from "react"

import {
  redirect,
} from "~/i18n"
import {
  getServerAuthSession,
} from "~/server/auth"
import {
  AppInitializer,
} from "~/shared/components/app-initializer"
import {
  Header,
} from "~/shared/components/layouts/header/header"
import {
  AppSidebar,
} from "~/shared/components/layouts/sidebar"
import {
  BasePage,
} from "~/shared/components/shared/page-component"
import {
  SidebarInset, SidebarProvider,
} from "~/shared/components/ui/sidebar"

export default async function DashboardLayout({ children }: Readonly<{
  children: ReactNode
}>) {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/login")
  }
  if (!session) {
    return
  }
  return (
    <AppInitializer session={session}>

      <SidebarProvider style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
      >
        <AppSidebar />

        <SidebarInset className="grow">

          <Header />

          <BasePage>
            {children}
          </BasePage>
        </SidebarInset>
      </SidebarProvider>
    </AppInitializer>

  )
}
