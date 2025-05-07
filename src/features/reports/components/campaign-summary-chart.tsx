"use client"

import React from "react"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

import {
  type CampaignStat,
} from "~/features/reports/types/report"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

interface CampaignSummaryChartProps {
  title: string
  description: string
  data: CampaignStat[]
  type: "traffic" | "backlink"
}

export function CampaignSummaryChart({
  title,
  description,
  data,
  type,
}: CampaignSummaryChartProps) {
  const colors = {
    traffic: "#27BDBE", // accent color
    backlink: "#104f50", // primary color
    grid: "#e5e7eb",
    text: "#6b7280",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={data}
              margin={
                {
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }
              }
            >
              <defs>
                <linearGradient
                  id={`color${type}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={type === "traffic" ? colors.traffic : colors.backlink}
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor={type === "traffic" ? colors.traffic : colors.backlink}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={colors.grid}
              />

              <XAxis
                dataKey="date"
                stroke={colors.text}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke={colors.text}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `${value.toLocaleString()}`}
              />

              <Tooltip
                contentStyle={
                  {
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }
                }
                formatter={
                  (value: number) => [
                    `${value.toLocaleString()}`,
                    type === "traffic" ? "Traffic" : "Backlinks",
                  ]
                }
                labelFormatter={label => `Ngày ${label}`}
              />

              <Legend />

              <Area
                type="monotone"
                dataKey="value"
                stroke={type === "traffic" ? colors.traffic : colors.backlink}
                fillOpacity={1}
                fill={`url(#color${type})`}
                name={type === "traffic" ? "Traffic" : "Backlinks"}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
