import React from "react"

// import {
//   BarChart2, Calendar, Tag, Target, Link as LinkIcon,
// } from "lucide-react"
import {
  BarChart2, Calendar, Target, Link as LinkIcon,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

interface CampaignProgressCardProps {
  className?: string
  startDate: string
  endDate: string
  progress: number
  daysRemaining: number
  totalTraffic: number
  // keywordCount: number
  linkCount: number
}

export const CampaignProgressCard: React.FC<CampaignProgressCardProps> = ({
  className = "",
  startDate,
  endDate,
  progress,
  daysRemaining,
  totalTraffic,
  // keywordCount,
  linkCount,
}) => {
  const t = useTranslations("trafficSeoCampaigns")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      "vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    )
  }

  return (
    <Card className={`border-neutral-200 dark:border-neutral-800 ${className}`}>
      <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <CardTitle className="flex items-center text-lg">
          <BarChart2 className="mr-2 size-5 text-foreground" />

          {t("detail.progress")}
        </CardTitle>

        <CardDescription>
          {t("detail.campaignTimeline")}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>{formatDate(startDate)}</span>

              <span className="font-semibold">
                {daysRemaining}

                {" "}

                {t("detail.daysRemaining")}
              </span>

              <span>{formatDate(endDate)}</span>
            </div>

            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div
                className="bg-primary h-full rounded-full"
                style={
                  {
                    width: `${progress}%`,
                  }
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 pt-2">
            {/* Days Remaining */}
            <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-foreground mb-1">
                <Calendar className="size-4" />

                <h4 className="text-xs font-medium truncate uppercase">{t("detail.daysRemaining")}</h4>
              </div>

              <p className="text-2xl font-bold">{daysRemaining}</p>
            </div>

            {/* Target Traffic */}
            <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-foreground mb-1">
                <Target className="size-4" />

                <h4 className="text-xs font-medium truncate uppercase">{t("detail.targetTraffic")}</h4>
              </div>

              <p className="text-2xl font-bold">{totalTraffic.toLocaleString()}</p>
            </div>

            {/* Keywords */}
            {/* <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-foreground mb-1">
                <Tag className="size-4" />

                <h4 className="text-xs font-medium truncate uppercase">{t("detail.keywordCount")}</h4>
              </div>

              <p className="text-2xl font-bold">{keywordCount}</p>
            </div> */}

            {/* Backlinks */}
            <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-foreground mb-1">
                <LinkIcon className="size-4" />

                <h4 className="text-xs font-medium truncate uppercase">{t("detail.linkCount")}</h4>
              </div>

              <p className="text-2xl font-bold">{linkCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
