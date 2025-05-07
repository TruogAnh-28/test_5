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
  searchTransactions,
} from "~/features/transaction/api/transaction"
import {
  TransactionHistoryFilters,
} from "~/features/transaction/components/filters/transaction-history-filters"
import {
  TransactionHistoryTableAdmin,
} from "~/features/transaction/components/table/transaction-history-table-admin"
import {
  TransactionType,
  type TransactionFilter,
} from "~/features/transaction/type/transaction"

export function ViewTransactionHistoryAdmin() {
  const t = useTranslations("transaction")

  const defaultFilters: TransactionFilter = {
    key: "",
    page: 1,
    limit: 10,
    type: TransactionType.PAY_SERVICE,
    status: undefined,
    start_date: undefined,
    end_date: undefined,
  }

  const [
    filters,
    setFilters,
  ] = useUrlState<TransactionFilter>(defaultFilters)

  const {
    data: transactionsData,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "searchTransactions",
      filters,
    ],
    queryFn: () => searchTransactions(filters),
  })

  const handleFilterClick = () => {
    refetch()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">{t("title")}</h1>
      </div>

      <TransactionHistoryTableAdmin
        data={transactionsData?.data.transaction || []}
        total={transactionsData?.data.total}
        filters={filters}
        onFiltersChange={setFilters}
        onFilterClick={handleFilterClick}
        FiltersComponent={
          (
            <TransactionHistoryFilters
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
