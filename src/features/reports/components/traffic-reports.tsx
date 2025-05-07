"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  Keyboard,
} from "lucide-react"
import {
  useSession,
} from "next-auth/react"
import {
  useTranslations,
} from "next-intl"

import {
  useUrlState,
} from "~/shared/hooks/state/use-url-state"

import {
  getOneCampaignReport, searchCampaigns,
} from "~/features/reports/api/reports"
import {
  CampaignInfoCard,
} from "~/features/reports/components/cards/campaign-info-card"
import {
  CampaignStatsCard,
} from "~/features/reports/components/cards/campaign-stats-card"
import {
  KeywordTrafficChart,
} from "~/features/reports/components/charts/keyword-traffic-chart"
import {
  LinkTrafficChart,
} from "~/features/reports/components/charts/link-traffic-chart"
import {
  KeywordsTable,
} from "~/features/reports/components/tables/keywords-table"
import {
  LinksTable,
} from "~/features/reports/components/tables/links-table"
import {
  Link,
} from "~/i18n"
import {
  ErrorView,
} from "~/shared/components/shared/error"
import {
  Loading,
} from "~/shared/components/shared/loading"
import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent,
} from "~/shared/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "~/shared/components/ui/select"

interface TrafficReportsProps {
  userId?: number
}
const getBadgeStyles = (status: string) => {
  if (status === "ACTIVE")
    return "bg-green-100 text-green-800 border-green-200 font-medium"
  if (status === "PAUSED")
    return "bg-yellow-100 text-yellow-800 border-yellow-200 font-medium"
  if (status === "CANCELED")
    return "bg-red-100 text-red-800 border-red-200 font-medium"
  if (status === "COMPLETED")
    return "bg-blue-100 text-blue-800 border-blue-200 font-medium"
  return "bg-gray-100 text-gray-800 border-gray-200 font-medium"
}

export function TrafficReports({ userId }: TrafficReportsProps = {
}) {
  const t = useTranslations("report")
  const { data: session } = useSession()
  const effectiveUserId = userId || session?.user?.id

  const defaultFilters = {
    campaign_id: "",
    from_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    to_date: new Date().toISOString(),
  }

  const [
    filters,
    setFilters,
  ] = useUrlState(defaultFilters)

  const {
    data: campaignsData,
    isLoading: isLoadingCampaigns,
    error: campaignsError,
  } = useQuery({
    queryKey: [
      "trafficCampaigns",
      effectiveUserId,
    ],
    queryFn: () => searchCampaigns({
      userId: effectiveUserId!,
      campaignTypeId: 1,
      page: 1,
      limit: 100,
    }),
    enabled: !!effectiveUserId,
  })

  const campaigns = campaignsData?.data.campaigns || []

  const selectedCampaignId = filters.campaign_id || (campaigns[0]?.id.toString() || "")

  const {
    data: reportData,
    isLoading: isLoadingReport,
    error: reportError,
  } = useQuery({
    queryKey: [
      "trafficCampaignReport",
      selectedCampaignId,
    ],
    queryFn: () => getOneCampaignReport(Number(selectedCampaignId)),
    enabled: !!(selectedCampaignId && campaigns.length > 0),
  })

  const selectedCampaign = campaigns.find(campaign => campaign.id.toString() === selectedCampaignId)
  const campaignReport = reportData?.data

  const isLoading = isLoadingCampaigns || isLoadingReport
  const error = campaignsError || reportError
  const totalCompletedTraffic = campaignReport?.keywords.reduce(
    (
      total, keyword
    ) => total + (keyword.trafficCompleted || 0),
    0
  )
  const trafficProgress = (campaignReport?.totalTraffic ?? 0) > 0
    ? Math.round(((totalCompletedTraffic ?? 0) / ((campaignReport?.totalTraffic ?? 1))) * 100)
    : 0
  if (isLoading) return <Loading />
  if (error) return <ErrorView error={error} />

  if (campaigns.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] border-0 shadow">
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <div className="mx-auto size-16 mb-4 rounded-full bg-gradient-to-r from-[#2a7b90] to-[#23a6c7] flex items-center justify-center">
              <Keyboard className="size-8 text-white" />
            </div>

            <h3 className="text-lg font-medium mb-2">{t("trafficReport.noCampaigns")}</h3>

            <p className="text-muted-foreground mb-6">{t("trafficReport.createCampaignPrompt")}</p>

            <Button
              className="bg-gradient-to-r from-[#0c9697] to-[#27BDBE] hover:from-[#0a8485] hover:to-[#239fa0] text-white"
            >
              <Link href="/traffic-seo-campaigns/create">
                {t("overview.newCampaign")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={selectedCampaignId}
            onValueChange={
              value => setFilters({
                ...filters,
                campaign_id: value,
              })
            }
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder={t("trafficReport.selectCampaign")} />
            </SelectTrigger>

            <SelectContent className="bg-white border shadow-md">
              {
                campaigns.map(campaign => (
                  <SelectItem
                    key={campaign.id}
                    value={campaign.id.toString()}
                  >
                    {campaign.name}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>

          {
            selectedCampaign ? (
              <Badge
                variant="outline"
                className={getBadgeStyles(selectedCampaign?.status)}
              >
                {selectedCampaign?.status}
              </Badge>
            ) : null
          }
        </div>
      </div>

      {
        campaignReport ? (
          <React.Fragment>
            <div className="grid gap-4 lg:grid-cols-3">
              <CampaignStatsCard
                title={t("trafficReport.totalTraffic")}
                value={campaignReport.totalTraffic.toLocaleString()}
                subValue={t("trafficReport.targetCompletion")}
                progress={trafficProgress}
                icon={<Keyboard className="size-4 text-[#27BDBE]" />}
              />

              <CampaignStatsCard
                title={t("trafficReport.keywords")}
                value={campaignReport.keywordCount.toLocaleString()}
                subValue={t("trafficReport.activeKeywords")}
                icon={<Keyboard className="size-4 text-[#0c9697]" />}
              />

              <CampaignInfoCard
                title={t("trafficReport.campaignInfo")}
                domain={campaignReport.campaignDomain}
                status={selectedCampaign?.status}
                startDate={campaignReport.startDate}
                endDate={campaignReport.endDate}
              />
            </div>

            <div className="grid gap-4 grid-cols-1">
              {
                campaignReport.keywords.length > 0 && (
                  <KeywordTrafficChart
                    keywords={campaignReport.keywords}
                    title={t("keywordPerformance.title")}
                    description={t("keywordPerformance.description")}
                  />
                )
              }

              {
                campaignReport.links.length > 0 && (
                  <LinkTrafficChart
                    links={campaignReport.links}
                    title={t("trafficReport.links")}
                    description={t("trafficReport.linksDescription")}
                  />
                )
              }
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              <KeywordsTable
                keywords={campaignReport.keywords}
                title={t("keywordPerformance.title")}
                description={t("keywordPerformance.description")}
                emptyMessage={t("keywordPerformance.noKeywords")}
              />

              <LinksTable
                links={campaignReport.links}
                title={t("trafficReport.links")}
                description={t("trafficReport.linksDescription")}
                emptyMessage={t("trafficReport.noLinks")}
              />
            </div>
          </React.Fragment>
        ) : (
          <Card className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] border-0 shadow">
            <CardContent className="pt-6">
              <div className="text-center p-8">
                <h3 className="text-lg font-medium mb-2">{t("trafficReport.selectCampaignPrompt")}</h3>

                <p className="text-muted-foreground">{t("trafficReport.noReportData")}</p>
              </div>
            </CardContent>
          </Card>
        )
      }
    </div>
  )
}
