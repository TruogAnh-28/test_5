"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  useTranslations,
} from "next-intl"

import {
  useUrlState,
} from "~/shared/hooks/state/use-url-state"

import {
  searchAgencyReferrals,
} from "~/features/agency/api/agency"
import {
  AgencyTableAdmin,
} from "~/features/agency/components/tables/agency-table-admin"

export function ViewAgencyAdmin() {
  const t = useTranslations("agency")

  const defaultFilters = {
    key: "",
    page: 1,
    limit: 10,
  }

  const [
    filters,
    setFilters,
  ] = useUrlState(defaultFilters)

  const {
    data: agenciesData,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "searchAgencies",
      filters,
    ],
    queryFn: () => searchAgencyReferrals(filters),
  })

  const handleFilterClick = () => {
    refetch()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">{t("title")}</h1>
      </div>

      <AgencyTableAdmin
        data={agenciesData?.data.list || []}
        total={agenciesData?.data.total}
        filters={filters}
        onFiltersChange={setFilters}
        onFilterClick={handleFilterClick}
        hasReset
        error={error}
        isLoading={isLoading}
      />
    </div>
  )
}
