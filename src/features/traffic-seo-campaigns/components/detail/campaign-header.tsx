import React from "react"

// import {
//   useTranslations,
// } from "next-intl"

// import {
//   Badge,
// } from "~/shared/components/ui/badge"

interface CampaignHeaderProps {
  campaignName: string
  campaignId: number | string
  // progress: number
}

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  campaignName,
  campaignId,
  // progress,
}) => {
  // const t = useTranslations("trafficSeoCampaigns")

  // Get badge variant based on progress
  // const getStatusBadgeVariant = () => {
  //   if (progress < 25) return "outline"
  //   if (progress < 75) return "secondary"
  //   if (progress < 100) return "default"
  //   return "default"
  // }

  // // Get status text based on progress
  // const getStatusText = () => {
  //   if (progress < 25) return t("detail.statusJustStarted")
  //   if (progress < 75) return t("detail.statusInProgress")
  //   if (progress < 100) return t("detail.statusNearlyComplete")
  //   return t("detail.statusComplete")
  // }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
      <div>
        <h1 className="text-lg font-medium overflow-hidden text-ellipsis">{campaignName}</h1>

        <p className="text-sm text-muted-foreground">
          ID:
          {" "}

          {campaignId}
        </p>
      </div>

      {/* <Badge variant={getStatusBadgeVariant()}>
        {getStatusText()}
      </Badge> */}
    </div>
  )
}
