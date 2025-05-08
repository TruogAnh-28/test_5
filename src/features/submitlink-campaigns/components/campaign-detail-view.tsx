"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  Link as LinkIcon,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  getDetailCampaign,
} from "~/features/submitlink-campaigns/api/submitlink-campaigns"
import {
  CampaignHeader,
} from "~/features/submitlink-campaigns/components/detail/campaign-header"
import {
  CampaignProgressCard,
} from "~/features/submitlink-campaigns/components/detail/campaign-progress-card"
// import {
//   DomainInfoCard,
// } from "~/features/submitlink-campaigns/components/detail/domain-info-card"
import {
  ErrorCard,
} from "~/features/submitlink-campaigns/components/detail/error-card"
import {
  LinksList,
} from "~/features/submitlink-campaigns/components/detail/links-list"
import {
  Loading,
} from "~/shared/components/shared/loading"

export function CampaignDetailView({ id }: { id: number }) {
  const t = useTranslations("submitlinkCampaigns")

  const {
    data: campaignData,
    isLoading: isCampaignLoading,
    error: campaignError,
  } = useQuery({
    queryKey: [
      "getDetailCampaign",
      id,
    ],
    queryFn: () => getDetailCampaign(id),
    enabled: !!id,
  })

  const campaignDetail = campaignData?.data
  const links = campaignDetail?.links || []
  const isLoading = isCampaignLoading
  const error = campaignError

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return (
      <ErrorCard
        title={t("detail.errorTitle")}
        message={error instanceof Error ? error.message : t("detail.unknownError")}
      />
    )
  }

  if (!campaignDetail) {
    return (
      <ErrorCard
        title={t("detail.notFoundTitle")}
        message={t("detail.noDetailsFound")}
      />
    )
  }

  const calculateProgress = () => {
    const startDate = new Date(campaignDetail.startDate)
    const endDate = new Date(campaignDetail.endDate)
    const today = new Date()

    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsedDuration = today.getTime() - startDate.getTime()

    if (elapsedDuration <= 0) return 0
    if (elapsedDuration >= totalDuration) return 100

    return Math.round((elapsedDuration / totalDuration) * 100)
  }

  const calculateDaysRemaining = () => {
    const endDate = new Date(campaignDetail.endDate)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const progress = calculateProgress()
  const daysRemaining = calculateDaysRemaining()

  return (
    <div className="space-y-6">
      <CampaignHeader
        campaignName={campaignDetail.name}
        campaignId={campaignDetail.id}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <CampaignProgressCard
          className="md:col-span-2"
          startDate={campaignDetail.startDate}
          endDate={campaignDetail.endDate}
          progress={progress}
          daysRemaining={daysRemaining}
          totalTraffic={campaignDetail.totalTraffic}
          linkCount={links.length}
        />

        {/* <DomainInfoCard
          domain={campaignDetail.domain}
          cost={campaignDetail.totalCost}
        /> */}
      </div>

      <div className="w-full">
        <div className="mb-4 flex items-center gap-2">
          <LinkIcon className="size-4" />

          <h2 className="text-lg font-medium">
            {t("form.links.title")}

            {" "}

            (
            {links.length}
            )
          </h2>
        </div>

        <LinksList links={links} />
      </div>
    </div>
  )
}
