"use client"

import React, {
  useState,
} from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  subDays, format, isAfter, isBefore,
} from "date-fns"
import {
  Calendar,
} from "lucide-react"
import {
  useSession,
} from "next-auth/react"
import {
  useTranslations,
} from "next-intl"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  formatDateToUTC,
} from "~/shared/utils/date"

import {
  getReportItem,
  getReportItemAdmin,
} from "~/features/reports/api/reports"
import {
  DayPicker,
} from "~/shared/components/inputs/day-picker"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

export function CampaignTrafficChart() {
  const t = useTranslations("dashboard")
  const tCommon = useTranslations("common")
  const { data: session } = useSession()
  const isAdmin = session?.user?.role?.id === 1
  // Default date range - last 7 days
  const today = new Date()
  const defaultEndDate = formatDateToUTC(today)
  const defaultStartDate = formatDateToUTC(subDays(
    today, 7
  ))

  const [
    dateRange,
    setDateRange,
  ] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  })

  // Format date for display
  const formatDate = (date: string) => {
    const d = new Date(date)
    return format(
      d, "dd/MM"
    )
  }

  const handleDateChange = (
    type: "startDate" | "endDate", date: Date | undefined
  ) => {
    if (!date) return

    // Ensure end date is not in the future
    if (type === "endDate" && isAfter(
      date, today
    )) {
      date = today
    }

    // Ensure start date is not after end date
    if (type === "startDate" && isAfter(
      date, new Date(dateRange.endDate)
    )) {
      return
    }

    // Ensure end date is not before start date
    if (type === "endDate" && isBefore(
      date, new Date(dateRange.startDate)
    )) {
      return
    }

    setDateRange({
      ...dateRange,
      [type]: formatDateToUTC(date),
    })
  }

  const {
    data, isLoading, isError, error,
  } = useQuery({
    queryKey: [
      "dashboardTrafficReport",
      dateRange,
      isAdmin,
    ],
    queryFn: () =>
      isAdmin ? getReportItemAdmin({
        start_date: dateRange.startDate,
        end_date: dateRange.endDate,
      })
        : getReportItem({
          start_date: dateRange.startDate,
          end_date: dateRange.endDate,
          userId: session?.user?.id,
        }),
    enabled: !!session?.user.id,
  })

  const processChartData = () => {
    if (!data?.data || data.data.length === 0) return {
      chartData: [],
      campaigns: [],
    }

    const allDates = new Set<string>()
    data.data.forEach((campaign) => {
      campaign.traffic?.forEach((item) => {
        allDates.add(item.date)
      })
    })

    const sortedDates = Array.from(allDates).sort()

    const chartData = sortedDates.map((date) => {
      const dataPoint: Record<string, any> = {
        date: formatDate(date),
        rawDate: date,
      }

      data.data.forEach((campaign) => {
        dataPoint[`campaign_${campaign.campaignId}`] = 0
      })

      return dataPoint
    })

    data.data.forEach((campaign) => {
      campaign.traffic?.forEach((daily) => {
        const dataPoint = chartData.find(item => item.rawDate === daily.date)
        dataPoint && (dataPoint[`campaign_${campaign.campaignId}`] = daily.traffic)
      })
    })

    chartData.sort((
      a, b
    ) => {
      const dateA = new Date(a.rawDate)
      const dateB = new Date(b.rawDate)
      return dateA.getTime() - dateB.getTime()
    })

    return {
      chartData,
      campaigns: data.data.map(campaign => ({
        id: campaign.campaignId,
        name: campaign.campaignName,
      })),
    }
  }

  const {
    chartData, campaigns,
  } = processChartData()

  const colors = [
    "#2a7b90",
    "#27BDBE",
    "#4C51BF",
    "#ED64A6",
    "#48BB78",
    "#F6AD55",
    "#F56565",
    "#805AD5",
    "#667EEA",
    "#38B2AC",
  ]

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="size-8 animate-spin text-primary border-2 border-current border-t-transparent rounded-full" />

          <span className="ml-2 text-primary">{tCommon("loading")}</span>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-destructive">
            {error instanceof Error ? error.message : "Error loading data"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>
            {
              t(
                "trafficTrend", {
                  defaultValue: "Campaign Traffic Trends",
                }
              )
            }
          </CardTitle>

          <div className="flex gap-2">
            <DayPicker
              mode="single"
              selected={dateRange.startDate ? new Date(dateRange.startDate) : undefined}
              onSelect={
                date => handleDateChange(
                  "startDate", date
                )
              }
              TriggerComponent={
                (
                  <Button
                    variant="outline"
                    className="w-full justify-start font-normal"
                  >
                    <Calendar className="mr-2 size-4" />

                    {
                      format(
                        new Date(dateRange.startDate), "dd/MM/yyyy"
                      )
                    }
                  </Button>
                )
              }
            />

            <DayPicker
              mode="single"
              selected={dateRange.endDate ? new Date(dateRange.endDate) : undefined}
              onSelect={
                date => handleDateChange(
                  "endDate", date
                )
              }
              TriggerComponent={
                (
                  <Button
                    variant="outline"
                    className="w-full justify-start font-normal"
                  >
                    <Calendar className="mr-2 size-4" />

                    {
                      format(
                        new Date(dateRange.endDate), "dd/MM/yyyy"
                      )
                    }
                  </Button>
                )
              }
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-80">
        {
          chartData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={chartData}
                margin={
                  {
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }
                }
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip />

                <Legend />

                {
                  campaigns.map((
                    campaign, index
                  ) => (
                    <Line
                      key={campaign.id}
                      type="monotone"
                      dataKey={`campaign_${campaign.id}`}
                      name={campaign.name}
                      stroke={colors[index % colors.length]}
                      activeDot={
                        {
                          r: 8,
                        }
                      }
                      strokeWidth={2}
                    />
                  ))
                }
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">
                {
                  tCommon(
                    "noData", {
                      defaultValue: "No data available",
                    }
                  )
                }
              </p>
            </div>
          )
        }
      </CardContent>
    </Card>
  )
}
