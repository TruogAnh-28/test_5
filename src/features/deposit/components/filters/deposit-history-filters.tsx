"use client"

import React from "react"

import {
  Calendar,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  DepositStatus,
  type SearchDeposits,
} from "~/features/deposit/type/deposit"
import {
  type FilterField, FiltersContent,
} from "~/shared/components/dialogs/filters-content"
import {
  ChipPicker,
} from "~/shared/components/inputs/chip-picker"
import {
  DayPicker,
} from "~/shared/components/inputs/day-picker"
import {
  TextInput,
} from "~/shared/components/inputs/text-input"
import {
  Button,
} from "~/shared/components/ui/button"

const StatusOptions = [
  {
    label: "Chờ xử lý",
    value: DepositStatus.PENDING,
  },
  {
    label: "Thành công",
    value: DepositStatus.COMPLETED,
  },
  {
    label: "Thất bại",
    value: DepositStatus.FAILED,
  },
]

interface DepositHistoryFiltersProps {
  defaultFilters?: SearchDeposits
  filters?: SearchDeposits
  onFiltersChange?: (filters: SearchDeposits) => void
}

export function DepositHistoryFilters({
  defaultFilters, filters, onFiltersChange,
}: DepositHistoryFiltersProps) {
  const t = useTranslations("deposit")
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
        name: "fromDate",
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
        name: "toDate",
        title: t("filter.toDate"),
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

                  {field.value ? new Date(field.value).toLocaleDateString("vi-VN") : t("filter.chooseToDate")}
                </Button>
              )
            }
          />
        ),
      },
      {
        name: "codeTransaction",
        title: t("filter.code"),
        children: ({ field }) => (
          <TextInput
            {...field}
            placeholder={t("filter.codePlaceholder")}
          />
        ),
      },
    ],
    []
  )

  const handleFiltersChange = React.useCallback(
    (updatedFilters: Record<string, unknown>) => {
      if (onFiltersChange) {
        onFiltersChange(updatedFilters as SearchDeposits)
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
