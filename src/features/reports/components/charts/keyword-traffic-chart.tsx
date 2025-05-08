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
  Legend,
} from "recharts"

import {
  type KeywordAttributes,
} from "~/features/reports/types/report"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

interface KeywordTrafficChartProps {
  keywords: KeywordAttributes[]
  title: string
  description: string
}

export function KeywordTrafficChart({
  keywords, title, description,
}: KeywordTrafficChartProps) {
  // Prepare data for chart
  const chartData = keywords.map(keyword => ({
    name: keyword.name, // Keep full keyword name
    completed: Number(keyword.trafficCompleted),
    target: Number(keyword.traffic) - Number(keyword.trafficCompleted), // Calculate difference
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          {/* Increased height to accommodate longer names */}
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
                width={150}
                tick={
                  {
                    fontSize: 12,
                  }
                }
                tickMargin={5}
              />

              <Tooltip
                labelFormatter={(label: string) => `Keyword: ${label}`}
                formatter={
                  (
                    value: number,
                    name: "target" | "completed"
                  ) => {
                    const displayNames = {
                      target: "Remaining Target Traffic",
                      completed: "Achieved Traffic",
                    }
                    const displayName = displayNames[name] || name
                    return [
                      value,
                      displayName,
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

              <Legend />

              <Bar
                dataKey="completed"
                name="Achieved Traffic"
                barSize={20}
                fill="#0c9697"
                stackId="traffic"
              />

              <Bar
                dataKey="target"
                name="Remaining Target Traffic"
                barSize={20}
                fill="#23a6c7"
                fillOpacity={0.3}
                stackId="traffic"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
