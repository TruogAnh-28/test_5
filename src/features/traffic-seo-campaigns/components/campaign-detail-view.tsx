"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  Tag,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  getDetailCampaign,
} from "~/features/traffic-seo-campaigns/api/traffic-seo-campaigns"
import {
  getKeywordByCampaign,
} from "~/features/traffic-seo-campaigns/api/traffic-seo-campaigns-api-extension"
import {
  CampaignProgressCard,
} from "~/features/traffic-seo-campaigns/components/detail/campaign-progress-card"
import {
  DomainInfoCard,
} from "~/features/traffic-seo-campaigns/components/detail/domain-info-card"
import {
  ErrorCard,
} from "~/features/traffic-seo-campaigns/components/detail/error-card"
import {
  KeywordsList,
} from "~/features/traffic-seo-campaigns/components/detail/keywords-list"
import {
  Loading,
} from "~/shared/components/shared/loading"

export function CampaignDetailView({ id }: { id: number }) {
  const t = useTranslations("trafficSeoCampaigns")

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

  const {
    data: keywordsData,
    isLoading: isKeywordsLoading,
    error: keywordsError,
  } = useQuery({
    queryKey: [
      "getKeywordyCampaign",
      id,
    ],
    queryFn: () => getKeywordByCampaign(id),
    enabled: !!id,
  })

  const campaignDetail = campaignData?.data
  const keywords = keywordsData?.data || []
  const isLoading = isCampaignLoading || isKeywordsLoading
  const error = campaignError || keywordsError

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-lg font-medium overflow-hidden text-ellipsis">{campaignDetail.name}</h1>

          <p className="text-sm text-muted-foreground">
            ID:
            {" "}

            {campaignDetail.id}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <CampaignProgressCard
          className="md:col-span-2"
          startDate={campaignDetail.startDate}
          endDate={campaignDetail.endDate}
          progress={progress}
          daysRemaining={daysRemaining}
          totalTraffic={campaignDetail.totalTraffic}
          keywordCount={keywords.length}
        />

        <DomainInfoCard
          domain={campaignDetail.domain}
          cost={campaignDetail.totalCost}
          title={campaignDetail.title}
        />
      </div>

      <div className="w-full">
        <div className="mb-4 flex items-center gap-2">
          <Tag className="size-4" />

          <h2 className="text-lg font-medium">
            {t("form.keywords.title")}

            {" "}

            (
            {keywords.length}
            )
          </h2>
        </div>

        <KeywordsList
          keywords={keywords}
        />
      </div>
    </div>
  )
}
