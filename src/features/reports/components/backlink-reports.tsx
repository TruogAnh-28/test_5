"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  Calendar, LinkIcon, BarChart2,
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
  LinkTrafficChart,
} from "~/features/reports/components/charts/link-traffic-chart"
import {
  LinksTable,
} from "~/features/reports/components/tables/links-table"
import {
  DayPicker,
} from "~/shared/components/inputs/day-picker"
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

interface BacklinkReportsProps {
  userId?: number // Make userId optional to support both admin and user views
}

export function BacklinkReports({ userId }: BacklinkReportsProps = {
}) {
  const t = useTranslations("report")
  const { data: session } = useSession()
  // Use the provided userId if available (admin view), otherwise use the current user's id (user view)
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
      "backlinkCampaigns",
      effectiveUserId,
    ],
    queryFn: () => searchCampaigns({
      userId: effectiveUserId!,
      campaignTypeId: 2,
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
      "backlinkCampaignReport",
      selectedCampaignId,
    ],
    queryFn: () => getOneCampaignReport(Number(selectedCampaignId)),
    enabled: !!(selectedCampaignId && campaigns.length > 0),
  })

  const selectedCampaign = campaigns.find(campaign => campaign.id.toString() === selectedCampaignId)
  const campaignReport = reportData?.data

  const isLoading = isLoadingCampaigns || isLoadingReport
  const error = campaignsError || reportError

  if (isLoading) return <Loading />
  if (error) return <ErrorView error={error} />

  if (campaigns.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] border-0 shadow">
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <div className="mx-auto size-16 mb-4 rounded-full bg-gradient-to-r from-[#2a7b90] to-[#23a6c7] flex items-center justify-center">
              <LinkIcon className="size-8 text-white" />
            </div>

            <h3 className="text-lg font-medium mb-2">{t("backlinkReport.noCampaigns")}</h3>

            <p className="text-muted-foreground mb-6">{t("backlinkReport.createCampaignPrompt")}</p>
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
              <SelectValue placeholder={t("backlinkReport.selectCampaign")} />
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
                variant={selectedCampaign?.status === "ACTIVE" ? "outline" : "secondary"}
                className={
                  selectedCampaign?.status === "ACTIVE"
                    ? "bg-success/20 text-success border-success/20"
                    : ""
                }
              >
                {selectedCampaign?.status}
              </Badge>
            ) : null
          }
        </div>

        <div className="flex gap-2">
          <DayPicker
            mode="single"
            selected={filters.from_date ? new Date(filters.from_date) : undefined}
            onSelect={
              date => date && setFilters({
                ...filters,
                from_date: date.toISOString(),
              })
            }
            TriggerComponent={
              (
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  <Calendar className="mr-2 size-4" />

                  {filters.from_date ? new Date(filters.from_date).toLocaleDateString("vi-VN") : t("overview.fromDate")}
                </Button>
              )
            }
          />

          <DayPicker
            mode="single"
            selected={filters.to_date ? new Date(filters.to_date) : undefined}
            onSelect={
              date => date && setFilters({
                ...filters,
                to_date: date.toISOString(),
              })
            }
            TriggerComponent={
              (
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  <Calendar className="mr-2 size-4" />

                  {filters.to_date ? new Date(filters.to_date).toLocaleDateString("vi-VN") : t("overview.toDate")}
                </Button>
              )
            }
          />
        </div>
      </div>

      {
        campaignReport ? (
          <React.Fragment>
            <div className="grid gap-4 lg:grid-cols-3">
              <CampaignStatsCard
                title={t("backlinkReport.totalBacklinks")}
                value={campaignReport.linkCount.toLocaleString()}
                subValue={t("backlinkReport.targetCompletion")}
                progress={100}
                icon={<LinkIcon className="size-4 text-[#27BDBE]" />}
              />

              <CampaignStatsCard
                title={t("backlinkReport.traffic")}
                value={campaignReport.totalTraffic.toLocaleString()}
                subValue={t("backlinkReport.estimatedTraffic")}
                icon={<BarChart2 className="size-4 text-[#0c9697]" />}
              />

              <CampaignInfoCard
                title={t("backlinkReport.campaignInfo")}
                domain={campaignReport.campaignDomain}
                status={selectedCampaign?.status}
                startDate={campaignReport.startDate}
                endDate={campaignReport.endDate}
              />
            </div>

            {
              campaignReport.links.length > 0 && (
                <div className="grid gap-4 md:grid-cols-1">
                  <LinkTrafficChart
                    links={campaignReport.links}
                    title={t("backlinkReport.topDomains")}
                    description={t("backlinkReport.topDomainsDesc")}
                  />
                </div>
              )
            }

            <div className="grid gap-4 md:grid-cols-1">
              <LinksTable
                links={campaignReport.links}
                title={t("backlinkReport.topDomains")}
                description={t("backlinkReport.topDomainsDesc")}
                emptyMessage={t("backlinkReport.noLinks")}
                isStatusVisible
              />

              <LinksTable
                links={campaignReport.links}
                title={t("backlinkReport.recentLinks")}
                description={t("backlinkReport.recentLinksDesc")}
                emptyMessage={t("backlinkReport.noRecentLinks")}
                isSourceVisible
                isAnchorTextVisible={false}
                isStatusVisible={false}
                showCreatedAt
              />
            </div>
          </React.Fragment>
        ) : (
          <Card className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] border-0 shadow">
            <CardContent className="pt-6">
              <div className="text-center p-8">
                <h3 className="text-lg font-medium mb-2">{t("backlinkReport.selectCampaignPrompt")}</h3>

                <p className="text-muted-foreground">{t("backlinkReport.noReportData")}</p>
              </div>
            </CardContent>
          </Card>
        )
      }
    </div>
  )
}
