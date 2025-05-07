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
    name: keyword.name.length > 12 ? `${keyword.name.substring(
      0, 12
    )}...` : keyword.name,
    target: Number(keyword.traffic),
    completed: Number(keyword.trafficCompleted),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-64">
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
                labelFormatter={(label: string) => `Keyword: ${label}`}
                formatter={
                  (
                    value: number, name: "target" | "completed"
                  ) => {
                    const displayNames = {
                      target: "Target Traffic",
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
                dataKey="target"
                name="Target Traffic"
                barSize={20}
                fill="#23a6c7"
                fillOpacity={0.3}
              />

              <Bar
                dataKey="completed"
                name="Achieved Traffic"
                barSize={20}
                fill="#0c9697"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
