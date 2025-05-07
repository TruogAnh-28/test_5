"use client"
import React from "react"

import {
  useTranslations,
} from "next-intl"

import {
  BacklinkReports,
} from "~/features/reports/components/backlink-reports"
import {
  TrafficReports,
} from "~/features/reports/components/traffic-reports"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/shared/components/ui/tabs"

export function CampaignReportsView() {
  const t = useTranslations("report")

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">{t("title")}</h1>
      </div>

      <Tabs defaultValue="traffic">
        <TabsList className="w-full mb-6 max-w-md">
          <TabsTrigger
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-700 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            value="traffic"
          >
            {t("overview.trafficCampaigns")}
          </TabsTrigger>

          <TabsTrigger
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-700 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            value="backlink"
          >
            {t("overview.backlinkCampaigns")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traffic">
          <TrafficReports />
        </TabsContent>

        <TabsContent value="backlink">
          <BacklinkReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}
