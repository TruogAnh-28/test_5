"use client"

import React from "react"

import {
  Calendar,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  TransactionStatus,
  type TransactionFilter,
} from "~/features/transaction/type/transaction"
import {
  type FilterField,
  FiltersContent,
} from "~/shared/components/dialogs/filters-content"
import {
  ChipPicker,
} from "~/shared/components/inputs/chip-picker"
import {
  DayPicker,
} from "~/shared/components/inputs/day-picker"
import {
  Button,
} from "~/shared/components/ui/button"

interface TransactionHistoryFiltersProps {
  defaultFilters?: TransactionFilter
  filters?: TransactionFilter
  onFiltersChange?: (filters: TransactionFilter) => void
}

export function TransactionHistoryFilters({
  defaultFilters,
  filters,
  onFiltersChange,
}: TransactionHistoryFiltersProps) {
  const t = useTranslations("transaction")

  const StatusOptions = [
    {
      label: t("status.completed"),
      value: TransactionStatus.COMPLETED,
    },
    {
      label: t("status.pending"),
      value: TransactionStatus.PENDING,
    },
    {
      label: t("status.failed"),
      value: TransactionStatus.FAILED,
    },
  ]

  const fields = React.useMemo<FilterField[]>(
    () => [
      {
        name: "status",
        title: t("table.status"),
        children: ({ field }) => (
          <ChipPicker
            options={StatusOptions}
            mode="single"
            value={field.value}
            onValueChange={value => field.onChange(value)}
            renderItem={
              option => (
                <div className="px-2 py-1.5 pr-3 rounded-full border-2 border-input group-data-[state=checked]:border-primary flex items-center gap-2">
                  <div className="size-4 border-2 rounded-full group-data-[state=checked]:border-4 group-data-[state=checked]:border-primary" />

                  {option.label}
                </div>
              )
            }
          />
        ),
      },
      {
        name: "start_date",
        title: t("filter.fromDate"),
        children: ({ field }) => (
          <DayPicker
            mode="single"
            selected={field.value ? new Date(field.value) : undefined}
            onSelect={date => field.onChange(date?.toISOString())}
            TriggerComponent={
              (
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 size-4" />

                  {field.value ? new Date(field.value).toLocaleDateString("vi-VN") : t("filter.chooseFromDate")}
                </Button>
              )
            }
          />
        ),
      },
      {
        name: "end_date",
        title: t("filter.toDate"),
        children: ({ field }) => (
          <DayPicker
            mode="single"
            selected={field.value ? new Date(field.value) : undefined}
            onSelect={
              (date) => {
                if (date) {
                // Set time to end of day for the end date
                  const endOfDay = new Date(date)
                  endOfDay.setHours(
                    23, 59, 59, 999
                  )
                  field.onChange(endOfDay.toISOString())
                }
                else {
                  field.onChange(undefined)
                }
              }
            }
            TriggerComponent={
              (
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 size-4" />

                  {field.value ? new Date(field.value).toLocaleDateString("vi-VN") : t("filter.chooseToDate")}
                </Button>
              )
            }
          />
        ),
      },
    ],
    [
      t,
      StatusOptions,
    ]
  )

  const handleFiltersChange = React.useCallback(
    (updatedFilters: Record<string, unknown>) => {
      if (onFiltersChange) {
        onFiltersChange(updatedFilters as TransactionFilter)
      }
    }, [onFiltersChange]
  )

  return (
    <FiltersContent
      defaultFilters={defaultFilters}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      fields={fields}
      hasBack
    />
  )
}
