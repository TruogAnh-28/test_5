"use client"

import React from "react"

import {
  ArrowUpRight,
} from "lucide-react"

import {
  Card, CardContent, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

interface CampaignStatsCardProps {
  title: string
  value: number | string
  total?: number
  subValue?: string
  progress?: number
  icon?: React.ReactNode
  className?: string
}

export function CampaignStatsCard({
  title,
  value,
  total,
  subValue,
  progress,
  icon,
  className,
}: CampaignStatsCardProps) {
  const percentage = progress !== undefined
    ? progress
    : (total ? Math.round((Number(value) / total) * 100) : undefined)

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          {title}

          {icon ? <span className="ml-2">{icon}</span> : null}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">{value}</div>

        {
          subValue ? (
            <div className="mt-1 text-sm text-muted-foreground">
              {subValue}
            </div>
          ) : null
        }

        {
          percentage !== undefined && (
            <div className="mt-2 flex items-center text-sm">
              <ArrowUpRight className="mr-1 size-3.5 text-success" />

              <span className="text-success">
                {percentage}
                %
              </span>
            </div>
          )
        }

        {/* Add a progress bar if percentage is provided */}
        {
          percentage !== undefined && (
            <div className="mt-3">
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2a7b90] to-[#23a6c7] rounded-full"
                  style={
                    {
                      width: `${percentage}%`,
                    }
                  }
                />
              </div>
            </div>
          )
        }
      </CardContent>
    </Card>
  )
}
