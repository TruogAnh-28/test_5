import React from "react"

interface CampaignHeaderProps {
  campaignName: string
  campaignId: number | string
}

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  campaignName,
  campaignId,

}) => {
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
    </div>
  )
}
