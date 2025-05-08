"use client"
import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  useSession,
} from "next-auth/react"
import {
  useTranslations,
} from "next-intl"
import {
  PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts"

import {
  getReportItemAdmin, getReportItem,
} from "~/features/reports/api/reports"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "~/shared/components/ui/card"
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "~/shared/components/ui/tabs"

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
]

export const CampaignDistributionChart = () => {
  const t = useTranslations("report")
  const { data: session } = useSession()
  const isAdmin = session?.user?.role?.id === 1

  const today = new Date()
  const startOfMonth = new Date(
    today.getFullYear(), today.getMonth(), 1
  )
  const endOfMonth = new Date(
    today.getFullYear(), today.getMonth() + 1, 0
  )

  const formattedStartDate = startOfMonth.toISOString()
  const formattedEndDate = endOfMonth.toISOString()

  const {
    data: reportItemsData, isLoading,
  } = useQuery({
    queryKey: [
      "reportItems",
      formattedStartDate,
      formattedEndDate,
      isAdmin,
    ],
    queryFn: () =>
      isAdmin
        ? getReportItemAdmin({
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        })
        : getReportItem({
          userId: session?.user.id,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        }),
    enabled: !!session?.user.id,
  })

  const reportItems = reportItemsData?.data || []

  const keywordData = reportItems.map(item => ({
    name: item.campaignName.length > 15 ? item.campaignName.substring(
      0, 15
    ) + "..." : item.campaignName,
    value: item.keywordCount,
    fullName: item.campaignName,
    campaignId: item.campaignId,
  }))

  const linkData = reportItems.map(item => ({
    name: item.campaignName.length > 15 ? item.campaignName.substring(
      0, 15
    ) + "..." : item.campaignName,
    value: item.linkCount,
    fullName: item.campaignName,
    campaignId: item.campaignId,
  }))

  const filteredKeywordData = keywordData.filter(item => item.value > 0)
  const filteredLinkData = linkData.filter(item => item.value > 0)

  interface TooltipProps {
    // eslint-disable-next-line react/boolean-prop-naming
    active?: boolean
    payload?: Array<{
      name: string
      value: number
      payload: {
        name: string
        value: number
        fullName: string
        campaignId: number
      }
    }>
    label?: string
  }

  const CustomTooltip: React.FC<TooltipProps> = ({
    active, payload,
  }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border rounded shadow-md">
          <p className="font-semibold text-gray-900">{data.fullName}</p>

          <p className="text-gray-700 mt-1">
            {
              t(
                "overview.totalKeywords", {
                  defaultValue: "Total Keywords",
                }
              )
            }

            :
            {" "}

            <span className="font-medium">{data.value}</span>
          </p>

          {/* <p className="text-xs text-gray-500 mt-1">
            {
              t(
                "overview.campaignId", {
                  defaultValue: "Campaign ID",
                }
              )
            }

            :
            {data.campaignId}
          </p> */}
        </div>
      )
    }
    return null
  }

  const CustomLinkTooltip: React.FC<TooltipProps> = ({
    active, payload,
  }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border rounded shadow-md">
          <p className="font-semibold text-gray-900">{data.fullName}</p>

          <p className="text-gray-700 mt-1">
            {
              t(
                "overview.totalBacklinks", {
                  defaultValue: "Total Backlinks",
                }
              )
            }

            :
            <span className="font-medium">{data.value}</span>
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {
              t(
                "overview.campaignId", {
                  defaultValue: "Campaign ID",
                }
              )
            }

            :
            {data.campaignId}
          </p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full size-12 border-y-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Combined Tabs View (Alternative) */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {
              t(
                "overview.title", {
                  defaultValue: "Campaign Overview",
                }
              )
            }
          </CardTitle>

          <CardDescription>
            {
              t(
                "overview.distribution", {
                  defaultValue: "Distribution of keywords and links across campaigns",
                }
              )
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue="keywords"
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger
                value="keywords"
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-700 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
              >
                {t("overview.totalKeywords")}
              </TabsTrigger>

              <TabsTrigger
                value="links"
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-700 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
              >
                {t("overview.totalBacklinks")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="keywords">
              <div className="h-64">
                {
                  filteredKeywordData.length > 0 ? (
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={filteredKeywordData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={
                            ({
                              name, percent,
                            }) => `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {
                            filteredKeywordData.map((
                              entry, index
                            ) => (
                              <Cell
                                key={`cell-${entry}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))
                          }
                        </Pie>

                        <Tooltip content={<CustomTooltip />} />

                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">
                        {
                          t(
                            "keywordPerformance.noKeywords", {
                              defaultValue: "No keywords found for any campaigns",
                            }
                          )
                        }
                      </p>
                    </div>
                  )
                }
              </div>
            </TabsContent>

            <TabsContent value="links">
              <div className="h-64">
                {
                  filteredLinkData.length > 0 ? (
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={filteredLinkData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#27BDBE"
                          dataKey="value"
                          nameKey="name"
                          label={
                            ({
                              name, percent,
                            }) => `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {
                            filteredLinkData.map((
                              entry, index
                            ) => (
                              <Cell
                                key={`cell-${entry}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))
                          }
                        </Pie>

                        <Tooltip content={<CustomLinkTooltip />} />

                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">
                        {
                          t(
                            "backlinkReport.noLinks", {
                              defaultValue: "No links found for any campaigns",
                            }
                          )
                        }
                      </p>
                    </div>
                  )
                }
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
