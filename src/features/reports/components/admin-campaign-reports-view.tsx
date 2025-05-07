"use client"

import React, {
  useState,
} from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  Users,
} from "lucide-react"
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
  searchUsers,
} from "~/features/user/api/user"
import {
  Loading,
} from "~/shared/components/shared/loading"
import {
  Card,
  CardContent,
} from "~/shared/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "~/shared/components/ui/select"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "~/shared/components/ui/tabs"

export function AdminCampaignReportsView() {
  const t = useTranslations("report")
  const [
    selectedUserId,
    setSelectedUserId,
  ] = useState<number | null>(null)

  // Fetch users for the admin to select
  const {
    data: usersResponse,
    isLoading: isLoadingUsers,
  } = useQuery({
    queryKey: ["searchUsers"],
    queryFn: () => searchUsers({
      key: "",
      limit: 100,
      page: 1,
      role_ids: [],
    }),
  })

  const users = usersResponse?.data.list || []

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">{t("admin.title")}</h1>
      </div>

      {/* User Selection */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-full md:w-auto">
          <label className="text-sm font-medium mb-1 block">
            {t("admin.selectUserLabel")}
          </label>

          {
            isLoadingUsers ? (
              <Loading />
            ) : (
              <Select
                value={selectedUserId?.toString() || ""}
                onValueChange={value => setSelectedUserId(Number(value))}
              >
                <SelectTrigger className="min-w-[250px]">
                  <SelectValue placeholder={t("admin.selectUserPlaceholder")} />
                </SelectTrigger>

                <SelectContent className="max-h-[300px] overflow-y-auto bg-white">
                  {
                    users.map(user => (
                      <SelectItem
                        key={user.id}
                        value={user.id.toString()}
                      >
                        {user.username}

                        {" "}

                        (
                        {user.email}
                        )
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            )
          }
        </div>
      </div>

      {
        selectedUserId ? (
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
              <TrafficReports userId={selectedUserId} />
            </TabsContent>

            <TabsContent value="backlink">
              <BacklinkReports userId={selectedUserId} />
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] border-0 shadow">
            <CardContent className="pt-6">
              <div className="text-center p-8">
                <div className="mx-auto size-16 mb-4 rounded-full bg-gradient-to-r from-[#2a7b90] to-[#23a6c7] flex items-center justify-center">
                  <Users className="size-8 text-white" />
                </div>

                <h3 className="text-lg font-medium mb-2">{t("admin.userSelectionPrompt")}</h3>

                <p className="text-muted-foreground mb-6">{t("admin.userSelectionDescription")}</p>
              </div>
            </CardContent>
          </Card>
        )
      }
    </div>
  )
}
