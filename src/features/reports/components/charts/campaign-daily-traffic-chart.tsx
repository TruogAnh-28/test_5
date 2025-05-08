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
  getOneCampaignReport,
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

interface CampaignDailyTrafficChartProps {
  campaignId: number
}

export function CampaignDailyTrafficChart({ campaignId }: CampaignDailyTrafficChartProps) {
  const t = useTranslations("trafficSeoCampaigns")
  const tCommon = useTranslations("common")

  const today = new Date()
  const defaultEndDate = today.toISOString().split("T")[0]
  const defaultStartDate = subDays(
    today, 7
  ).toISOString().split("T")[0]

  const [
    dateRange,
    setDateRange,
  ] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  })

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

    if (type === "endDate" && isAfter(
      date, today
    )) {
      date = today
    }

    if (type === "startDate" && isAfter(
      date, new Date(dateRange.endDate)
    )) {
      return
    }

    if (type === "endDate" && isBefore(
      date, new Date(dateRange.startDate)
    )) {
      return
    }

    setDateRange({
      ...dateRange,
      [type]: date.toISOString().split("T")[0],
    })
  }

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "campaignReport",
      campaignId,
      dateRange,
    ],
    queryFn: () => getOneCampaignReport(campaignId),
  })

  const processChartData = () => {
    if (!data?.data?.traffic || data.data.traffic.length === 0) {
      return []
    }

    const startDateObj = new Date(dateRange.startDate)
    const endDateObj = new Date(dateRange.endDate)

    return data.data.traffic
      .filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate >= startDateObj && itemDate <= endDateObj
      })
      .map(item => ({
        date: formatDate(item.date),
        traffic: item.traffic,
        rawDate: item.date,
      }))
      .sort((
        a, b
      ) => {
        const dateA = new Date(a.rawDate)
        const dateB = new Date(b.rawDate)
        return dateA.getTime() - dateB.getTime()
      })
  }

  const chartData = processChartData()

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
                "detail.dailyTrafficChart", {
                  defaultValue: "Daily Traffic",
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

                <Tooltip
                  formatter={
                    value => [
                      value,
                      t(
                        "detail.traffic", {
                          defaultValue: "Traffic",
                        }
                      ),
                    ]
                  }
                  labelFormatter={
                    label => t(
                      "detail.date", {
                        defaultValue: "Date",
                      }
                    ) + ": " + label
                  }
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="traffic"
                  name={
                    t(
                      "detail.dailyVisits", {
                        defaultValue: "Daily Visits",
                      }
                    )
                  }
                  stroke="#27BDBE"
                  activeDot={
                    {
                      r: 8,
                    }
                  }
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">
                {
                  tCommon(
                    "noData", {
                      defaultValue: "No data available for the selected date range",
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
