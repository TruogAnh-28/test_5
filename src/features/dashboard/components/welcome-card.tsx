"use client"

import React from "react"

import {
  BarChart3, TrendingUp,
} from "lucide-react"
import {
  useSession,
} from "next-auth/react"
import {
  useTranslations,
} from "next-intl"

import {
  Link,
} from "~/i18n"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent,
} from "~/shared/components/ui/card"

export function WelcomeCard() {
  const { data: session } = useSession()
  const t = useTranslations("dashboard.welcome")
  const userName = session?.user?.name || ""

  const hours = new Date().getHours()
  let greeting = t("morning")
  if (hours >= 12 && hours < 18) {
    greeting = t("afternoon")
  }
  if (hours >= 18) {
    greeting = t("evening")
  }

  return (
    <Card className="h-full overflow-hidden shadow-md">
      <CardContent className="flex flex-col justify-between h-full p-5 bg-gradient-to-r from-[#2a7b90] to-[#23a6c7] text-white">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            {greeting}

            {" "}

            {userName}
            !
          </h3>

          <p className="text-sm opacity-90">
            {t("message")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-4">
          <Button
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
            size="sm"
            asChild
          >
            <Link href="/traffic-seo-campaigns/create">
              <TrendingUp className="mr-2 size-4" />

              {t("newCampaign")}
            </Link>
          </Button>

          <Button
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
            size="sm"
            asChild
          >
            <Link href="/reports">
              <BarChart3 className="mr-2 size-4" />

              {t("viewReports")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
