"use client"

import React from "react"

import {
  Calendar, Filter, Smartphone, Tablet, Laptop,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  type SearchTrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
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
  Button,
} from "~/shared/components/ui/button"

export function TrafficSeoCampaignsFilters({
  defaultFilters,
  filters,
  onFiltersChange,
}: {
  defaultFilters?: SearchTrafficSeoCampaigns
  filters?: SearchTrafficSeoCampaigns
  onFiltersChange?: (filters: SearchTrafficSeoCampaigns) => void
}) {
  const t = useTranslations("trafficSeoCampaigns")

  const DeviceOptions = [
    {
      label: t("deviceOptions.mobile"),
      value: "mobile",
      icon: <Smartphone className="size-4" />,
    },
    {
      label: t("deviceOptions.tablet"),
      value: "tablet",
      icon: <Tablet className="size-4" />,
    },
    {
      label: t("deviceOptions.desktop"),
      value: "desktop",
      icon: <Laptop className="size-4" />,
    },
    {
      label: t("deviceOptions.all"),
      value: "all",
      icon: <Filter className="size-4" />,
    },
  ]

  const StatusOptions = [
    {
      label: t("statusOptions.active"),
      value: "ACTIVE",
    },
    {
      label: t("statusOptions.paused"),
      value: "PAUSED",
    },
    {
      label: t("statusOptions.notStarted"),
      value: "NOT_STARTED",
    },
    {
      label: t("statusOptions.completed"),
      value: "COMPLETED",
    },
    {
      label: t("statusOptions.cancel"),
      value: "CANCEL",
    },
  ]

  const fields = React.useMemo<FilterField[]>(
    () => [
      {
        name: "device",
        title: t("filters.device"),
        children: ({ field }) => (
          <ChipPicker
            options={DeviceOptions}
            mode="single"
            value={field.value}
            onValueChange={value => field.onChange(value)}
            renderItem={
              option => (
                <div className="px-2 py-1.5 pr-3 rounded-full border-2 border-input group-data-[state=checked]:border-primary flex items-center gap-2">
                  {option.icon}

                  {option.label}
                </div>
              )
            }
          />
        ),
      },
      {
        name: "status",
        title: t("filters.status"),
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
        name: "startDate",
        title: t("filters.startDate"),
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

                  {field.value ? new Date(field.value).toLocaleDateString("vi-VN") : t("filters.chooseStartDate")}
                </Button>
              )
            }
          />
        ),
      },
      {
        name: "endDate",
        title: t("filters.endDate"),
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

                  {field.value ? new Date(field.value).toLocaleDateString("vi-VN") : t("filters.chooseEndDate")}
                </Button>
              )
            }
          />
        ),
      },
    ],
    [t]
  )

  const handleFiltersChange = React.useCallback(
    (updatedFilters: Record<string, unknown>) => {
      if (onFiltersChange) {
        // Make sure we preserve any existing filter values
        onFiltersChange({
          ...filters,
          ...updatedFilters as SearchTrafficSeoCampaigns,
        })
      }
    },
    [
      onFiltersChange,
      filters,
    ]
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
