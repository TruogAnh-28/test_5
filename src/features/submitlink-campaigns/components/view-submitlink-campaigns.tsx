"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  Plus,
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
  searchSubmitlinkCampaigns,
} from "~/features/submitlink-campaigns/api/submitlink-campaigns"
import {
  SubmitlinkCampaignsFilters,
} from "~/features/submitlink-campaigns/components/filters/submitlink-campaigns-filters"
import {
  SubmitlinkCampaignsTable,
} from "~/features/submitlink-campaigns/components/tables/submitlink-campaigns-table"
import {
  type SearchSubmitlinkCampaigns,
} from "~/features/submitlink-campaigns/type/submitlink-campaigns"
import {
  Link,
} from "~/i18n"
import {
  Button,
} from "~/shared/components/ui/button"

export function ViewSubmitlinkCampaigns() {
  const t = useTranslations("submitlinkCampaigns")
  const { data: session } = useSession()

  const defaultFilters: SearchSubmitlinkCampaigns = {
    userId: session?.user?.id,
    key: "",
    page: 1,
    limit: 10,
    campaignTypeId: 3,
    status: undefined,
    device: undefined,
    domain: undefined,
    startDate: undefined,
    endDate: undefined,
  }

  const [
    filters,
    setFilters,
  ] = useUrlState<SearchSubmitlinkCampaigns>(defaultFilters)

  // Fetch data using React Query
  const {
    data: submitlinkCampaignsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "searchSubmitlinkCampaigns",
      filters,
    ],
    queryFn: () => searchSubmitlinkCampaigns(filters),
    enabled: !!session?.user?.id,
  })

  const handleFiltersChange = (value: Record<string, unknown>) => {
    setFilters(value as SearchSubmitlinkCampaigns)
  }

  const handleFilterClick = () => {
    refetch()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">{t("title")}</h1>

        <div className="flex items-center gap-2">
          <Button asChild>
            <Link
              href="/submitlink-campaigns/create"
            >
              <Plus className="size-4 mr-2" />

              {t("create")}
            </Link>
          </Button>
        </div>
      </div>

      <SubmitlinkCampaignsTable
        data={submitlinkCampaignsResponse?.data?.campaigns || []}
        total={submitlinkCampaignsResponse?.data?.total}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onFilterClick={handleFilterClick}
        FiltersComponent={
          (
            <SubmitlinkCampaignsFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          )
        }
        hasReset
        hasFilters
        error={error}
        isLoading={isLoading}
      />
    </div>
  )
}
