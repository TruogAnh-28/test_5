"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  ArrowUpRight, LinkIcon, Layers, Globe,
} from "lucide-react"
import {
  useSession,
} from "next-auth/react"
import {
  useTranslations,
} from "next-intl"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import {
  getReportItemAdmin, getOverviewCampaigns,
  getReportItem,
} from "~/features/reports/api/reports"
import {
  type SearchCampaignReport, type ReportItemResponse,
} from "~/features/reports/types/report"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "~/shared/components/ui/card"

function CampaignBarChart({ data }: { data: ReportItemResponse[] }) {
  const t = useTranslations("report")

  const chartData = data.map(item => ({
    name: item.campaignName.length > 20
      ? item.campaignName.substring(
        0, 20
      ) + "..."
      : item.campaignName,
    keywords: item.keywordCount,
    activeKeywords: item.activeKeyword,
    links: item.linkCount,
    activeLinks: item.activeLink,
    campaignId: item.campaignId,
  }))

  // Colors for the bars
  const colors = {
    keywords: "#8884d8",
    activeKeywords: "#4338ca",
    links: "#82ca9d",
    activeLinks: "#10b981",
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{t("overview.recentActivity")}</CardTitle>

        <CardDescription>
          {t("overview.traffic")}

          &

          {" "}

          {t("overview.links")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={chartData}
              margin={
                {
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }
              }
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
              />

              <YAxis />

              <Tooltip
                formatter={
                  (
                    value, name
                  ) => {
                    const label = name === "keywords"
                      ? t("overview.totalKeywords")
                      : name === "activeKeywords"
                        ? t("overview.activeKeywords")
                        : name === "links"
                          ? t("overview.totalBacklinks")
                          : t("overview.activeBacklinks")
                    return [
                      value,
                      label,
                    ]
                  }
                }
              />

              <Legend
                formatter={
                  (value) => {
                    return value === "keywords"
                      ? t("overview.totalKeywords")
                      : value === "activeKeywords"
                        ? t("overview.activeKeywords")
                        : value === "links"
                          ? t("overview.totalBacklinks")
                          : t("overview.activeBacklinks")
                  }
                }
              />

              <Bar
                dataKey="keywords"
                fill={colors.keywords}
              />

              <Bar
                dataKey="activeKeywords"
                fill={colors.activeKeywords}
              />

              <Bar
                dataKey="links"
                fill={colors.links}
              />

              <Bar
                dataKey="activeLinks"
                fill={colors.activeLinks}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function CampaignSummary() {
  const t = useTranslations("report")
  const { data: session } = useSession()

  // Check if user is admin (role.id === 1) or regular user (role.id === 2)
  const isAdmin = session?.user?.role?.id === 1

  const defaultParams: SearchCampaignReport = {
    status: "",
    start_date: "",
    end_date: "",
  }

  const activeParams: SearchCampaignReport = {
    status: "ACTIVE",
    start_date: "",
    end_date: "",
  }

  const today = new Date()
  const startOfMonth = new Date(
    today.getFullYear(), today.getMonth(), 1
  )
  const endOfMonth = new Date(
    today.getFullYear(), today.getMonth() + 1, 0
  )

  const formattedStartDate = startOfMonth.toISOString()
  const formattedEndDate = endOfMonth.toISOString()

  const { data: allCampaignsData } = useQuery({
    queryKey: [
      "campaignReport",
      defaultParams,
    ],
    queryFn: () => getOverviewCampaigns(defaultParams),
  })

  const { data: activeCampaignsData } = useQuery({
    queryKey: [
      "campaignReport",
      "active",
    ],
    queryFn: () => getOverviewCampaigns(activeParams),
  })

  const {
    data: reportItemsData, isLoading,
  } = useQuery({
    queryKey: [
      "reportItems",
      formattedStartDate,
      formattedEndDate,
      isAdmin,
    ],
    queryFn: () => {
      return isAdmin
        ? getReportItemAdmin({
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        })
        : getReportItem({
          userId: session?.user.id,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        })
    },
  })

  const trafficCampaigns = allCampaignsData?.data?.find(item => item.campaignTypeId === 1)
  const activeTrafficCampaigns = activeCampaignsData?.data?.find(item => item.campaignTypeId === 1)

  const backlinkCampaigns = allCampaignsData?.data?.find(item => item.campaignTypeId === 2)
  const activeBacklinkCampaigns = activeCampaignsData?.data?.find(item => item.campaignTypeId === 2)

  const totalTrafficCampaigns = trafficCampaigns?.count || 0
  const activeTrafficCampaignsCount = activeTrafficCampaigns?.count || 0

  const totalBacklinkCampaigns = backlinkCampaigns?.count || 0
  const activeBacklinkCampaignsCount = activeBacklinkCampaigns?.count || 0

  const reportItems = reportItemsData?.data || []

  const totalKeywords = reportItems.reduce(
    (
      sum, item
    ) => sum + item.keywordCount, 0
  )
  const activeKeywords = reportItems.reduce(
    (
      sum, item
    ) => sum + item.activeKeyword, 0
  )

  const totalLinks = reportItems.reduce(
    (
      sum, item
    ) => sum + item.linkCount, 0
  )
  const activeLinks = reportItems.reduce(
    (
      sum, item
    ) => sum + item.activeLink, 0
  )

  const keywordActivityRate = totalKeywords > 0
    ? Math.round((activeKeywords / totalKeywords) * 100)
    : 0

  const linkActivityRate = totalLinks > 0
    ? Math.round((activeLinks / totalLinks) * 100)
    : 0

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">{t("overview.title")}</h2>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("overview.trafficCampaigns")}
            </CardTitle>

            <Layers className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{totalTrafficCampaigns}</div>

            <p className="text-xs text-muted-foreground">
              {activeTrafficCampaignsCount}

              {" "}

              {t("overview.activeCampaigns")}
            </p>

            {
              totalTrafficCampaigns > 0 && (
                <div className="mt-2 flex items-center text-sm">
                  <ArrowUpRight className="mr-1 size-3.5 text-success" />

                  <span className="text-success">
                    {((activeTrafficCampaignsCount / totalTrafficCampaigns) * 100).toFixed(1)}

                    %

                    {" "}

                    {t("overview.active")}
                  </span>
                </div>
              )
            }
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("overview.backlinkCampaigns")}
            </CardTitle>

            <LinkIcon className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{totalBacklinkCampaigns}</div>

            <p className="text-xs text-muted-foreground">
              {activeBacklinkCampaignsCount}

              {" "}

              {t("overview.activeCampaigns")}
            </p>

            {
              totalBacklinkCampaigns > 0 && (
                <div className="mt-2 flex items-center text-sm">
                  <ArrowUpRight className="mr-1 size-3.5 text-success" />

                  <span className="text-success">
                    {((activeBacklinkCampaignsCount / totalBacklinkCampaigns) * 100).toFixed(1)}

                    %

                    {" "}

                    {t("overview.active")}
                  </span>
                </div>
              )
            }
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("overview.totalKeywords")}
            </CardTitle>

            <Globe className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{totalKeywords.toLocaleString()}</div>

            <p className="text-xs text-muted-foreground">
              {activeKeywords.toLocaleString()}

              {" "}

              {t("overview.activeKeywords")}
            </p>

            <div className="mt-2 flex items-center text-sm">
              <div className="size-3 rounded-full bg-success mr-1.5" />

              <span>
                {keywordActivityRate}

                %

                {" "}

                {t("overview.active")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("overview.totalBacklinks")}
            </CardTitle>

            <LinkIcon className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{totalLinks.toLocaleString()}</div>

            <p className="text-xs text-muted-foreground">
              {activeLinks.toLocaleString()}

              {" "}

              {t("overview.activeBacklinks")}
            </p>

            <div className="mt-2 flex items-center text-sm">
              <div className="size-3 rounded-full bg-success mr-1.5" />

              <span>
                {linkActivityRate}

                %

                {" "}

                {t("overview.active")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart for Campaign Data */}
      {
        !isLoading && reportItems.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            <CampaignBarChart data={reportItems} />
          </div>
        )
      }

      {/* Show a message if no data */}
      {
        !isLoading && reportItems.length === 0 && (
          <Card className="col-span-2">
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                {t("overview.noTrafficCampaigns")}
              </p>
            </CardContent>
          </Card>
        )
      }
    </div>
  )
}
