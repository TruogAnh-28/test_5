// src/features/reports/components/charts/LinkTrafficChart.tsx
"use client"

import React from "react"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import {
  type LinkAttributes,
} from "~/features/reports/types/report"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

interface LinkTrafficChartProps {
  links: LinkAttributes[]
  title: string
  description: string
}

export function LinkTrafficChart({
  links, title, description,
}: LinkTrafficChartProps) {
  // For links, we can use the page or use a shortened version of the URL
  const chartData = links.map((link) => {
    // Display either page or a shortened version of the URL
    const displayName = link.page || (new URL(link.url)).hostname
    return {
      name: displayName.length > 15 ? `${displayName.substring(
        0, 15
      )}...` : displayName,
      url: link.url,
      traffic: Number(link.traffic),
    }
  })

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
            <BarChart
              data={chartData}
              layout="vertical"
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

              <XAxis type="number" />

              <YAxis
                dataKey="name"
                type="category"
                width={100}
              />

              <Tooltip
                formatter={
                  (value,) => {
                    return [
                      value,
                      "Traffic",
                    ]
                  }
                }
                contentStyle={
                  {
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }
                }
              />

              <Bar
                dataKey="traffic"
                name="Traffic"
                barSize={20}
                className="fill-[#27BDBE]"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
