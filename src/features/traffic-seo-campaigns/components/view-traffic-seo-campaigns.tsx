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
  searchTrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/api/traffic-seo-campaigns"
import {
  TrafficSeoCampaignsFilters,
} from "~/features/traffic-seo-campaigns/components/filters/traffic-seo-campaigns-filters"
import {
  TrafficSeoCampaignsTable,
} from "~/features/traffic-seo-campaigns/components/tables/traffic-seo-campaigns-table"
import {
  type SearchTrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  Link,
} from "~/i18n"
import {
  Button,
} from "~/shared/components/ui/button"

export function ViewTrafficSeoCampaigns() {
  const t = useTranslations("trafficSeoCampaigns")
  const { data: session } = useSession()

  const defaultFilters: SearchTrafficSeoCampaigns = {
    userId: session?.user?.id,
    key: "",
    page: 1,
    limit: 10,
    campaignTypeId: 1,
    status: undefined,
    device: undefined,
    domain: undefined,
    startDate: undefined,
    endDate: undefined,
  }

  const [
    filters,
    setFilters,
  ] = useUrlState<SearchTrafficSeoCampaigns>(defaultFilters)

  // Fetch data using React Query
  const {
    data: trafficSeoCampaignsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "searchTrafficSeoCampaigns",
      filters,
    ],
    queryFn: () => searchTrafficSeoCampaigns(filters),
    enabled: !!session?.user?.id,
  })
  const handleFiltersChange = (value: Record<string, unknown>) => {
    setFilters(value as SearchTrafficSeoCampaigns)
  }

  const handleFilterClick = () => {
    refetch()
  }

  const handlePauseSuccess = () => {
    refetch()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">{t("title")}</h1>

        <div className="flex items-center gap-2">
          <Button asChild>
            <Link
              href="/traffic-seo-campaigns/create"
            >
              <Plus className="size-4 mr-2" />

              {t("create")}
            </Link>
          </Button>
        </div>
      </div>

      <TrafficSeoCampaignsTable
        data={trafficSeoCampaignsResponse?.data?.campaigns || []}
        total={trafficSeoCampaignsResponse?.data?.total}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onFilterClick={handleFilterClick}
        FiltersComponent={
          (
            <TrafficSeoCampaignsFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          )
        }
        hasReset
        hasFilters
        onPauseSuccess={handlePauseSuccess}
        error={error}
        isLoading={isLoading}
      />
    </div>
  )
}
