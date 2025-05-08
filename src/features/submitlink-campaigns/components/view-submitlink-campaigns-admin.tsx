"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  Plus,
} from "lucide-react"
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
  SubmitlinkCampaignsTableAdmin,
} from "~/features/submitlink-campaigns/components/tables/submitlink-campaigns-table-admin"
import {
  type SearchSubmitlinkCampaigns,
} from "~/features/submitlink-campaigns/type/submitlink-campaigns"
import {
  Link,
} from "~/i18n"
import {
  Button,
} from "~/shared/components/ui/button"

export function ViewSubmitlinkCampaignsAdmin() {
  const t = useTranslations("submitlinkCampaigns")

  // Update default filters to match the new structure
  const defaultFilters: SearchSubmitlinkCampaigns = {
    key: "",
    page: 1,
    limit: 10,
    campaignTypeId: 3,
    status: undefined,
    device: undefined,
    domain: undefined,
    startDate: undefined,
    endDate: undefined,
    countryId: undefined,
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
  })

  const handleFilterClick = () => {
    refetch()
  }

  const handleDeleteSuccess = () => {
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

      <SubmitlinkCampaignsTableAdmin
        data={submitlinkCampaignsResponse?.data?.campaigns || []}
        total={submitlinkCampaignsResponse?.data?.total}
        filters={filters}
        onFiltersChange={setFilters}
        onFilterClick={handleFilterClick}
        FiltersComponent={
          (
            <SubmitlinkCampaignsFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          )
        }
        hasReset
        hasFilters
        onDeleteSuccess={handleDeleteSuccess}
        error={error}
        isLoading={isLoading}
      />
    </div>
  )
}
