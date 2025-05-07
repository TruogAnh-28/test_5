"use client"

import React from "react"

import {
  Globe, Calendar, Clock,
} from "lucide-react"

import {
  Card, CardContent, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

interface CampaignInfoCardProps {
  title: string
  domain: string
  status: string | undefined
  startDate: string
  endDate: string
  daysRemaining?: number
  className?: string
}

export function CampaignInfoCard({
  title,
  domain,
  status,
  startDate,
  endDate,
  daysRemaining,
  className,
}: CampaignInfoCardProps) {
  // Calculate days remaining if not provided
  const calculateDaysRemaining = () => {
    if (daysRemaining !== undefined) return daysRemaining

    const end = new Date(endDate)
    const now = new Date()
    const diffTime = Math.max(
      0, end.getTime() - now.getTime()
    )
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const days = calculateDaysRemaining()

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center">
          <Globe className="mr-2 size-4 text-[#27BDBE]" />

          <a
            href={`https://${domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate"
          >
            {domain}
          </a>
        </div>

        <div className="mt-3 space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 size-4 text-[#2a7b90]" />

            <span>
              {new Date(startDate).toLocaleDateString("vi-VN")}

              {" - "}

              {new Date(endDate).toLocaleDateString("vi-VN")}
            </span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 size-4 text-[#23a6c7]" />

            <span>
              {days}

              {" "}
              days remaining
            </span>
          </div>
        </div>

        {/* Progress indicator - only show if status is not 'completed' or 'paused' */}
        {
          status !== "completed" && status !== "paused" && (
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-[#27BDBE]/10 text-[#27BDBE]">
                      Campaign Progress
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-[#27BDBE]">
                      {
                        getProgressStatus({
                          startDate,
                          endDate,
                        })
                      }
                    </span>
                  </div>
                </div>

                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#27BDBE]/10 mt-1">
                  <div
                    style={
                      {
                        width: `${getProgressPercentage({
                          startDate,
                          endDate,
                        })}%`,
                      }
                    }
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#0c9697] to-[#27BDBE]"
                  />
                </div>
              </div>
            </div>
          )
        }
      </CardContent>
    </Card>
  )
}

function getProgressPercentage({
  startDate,
  endDate,
}: {
  startDate: string
  endDate: string
}): number {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const now = new Date().getTime()

  if (now <= start) return 0
  if (now >= end) return 100

  const total = end - start
  const current = now - start
  return Math.round((current / total) * 100)
}

function getProgressStatus({
  startDate,
  endDate,
}: {
  startDate: string
  endDate: string
}): string {
  const percentage = getProgressPercentage({
    startDate,
    endDate,
  })

  if (percentage === 0) return "Not Started"
  if (percentage < 30) return "Just Started"
  if (percentage < 70) return "In Progress"
  if (percentage < 100) return "Nearly Complete"
  return "Complete"
}
