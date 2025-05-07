"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
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
  searchDeposits,
} from "~/features/deposit/api/deposit"
import {
  DepositHistoryFilters,
} from "~/features/deposit/components/filters/deposit-history-filters"
import {
  DepositHistoryTable,
} from "~/features/deposit/components/table/deposit-history-table"
import {
  type DepositStatus,
} from "~/features/deposit/type/deposit"

export function ViewDepositHistory() {
  const t = useTranslations("deposit")
  const { data: session } = useSession()
  const defaultFilters = {
    userId: session?.user?.id,
    key: "",
    page: 1,
    limit: 10,
    status: undefined as DepositStatus | undefined,
    fromDate: undefined as string | undefined,
    toDate: undefined as string | undefined,
    codeTransaction: undefined as string | undefined,
  }

  const [
    filters,
    setFilters,
  ] = useUrlState(defaultFilters)

  const {
    data: deposits,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "searchDeposits",
      filters,
    ],
    queryFn: () => searchDeposits(filters),
  })

  const handleFilterClick = () => {
    refetch()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">
          {t("title")}
        </h1>
      </div>

      <DepositHistoryTable
        data={deposits?.data.list || []}
        total={deposits?.data.total}
        filters={filters}
        onFiltersChange={setFilters}
        onFilterClick={handleFilterClick}
        FiltersComponent={
          (
            <DepositHistoryFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          )
        }
        hasFilters
        hasReset
        error={error}
        isLoading={isLoading}
      />
    </div>
  )
}
