"use client"

import React from "react"

import {
  Calendar, Filter, Smartphone, Tablet,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  CampaignStatus,
  type SearchBacklinkCampaigns,
} from "~/features/backlink-campaigns/type/backlink-campaigns"
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

interface BacklinkCampaignsFiltersProps {
  defaultFilters?: SearchBacklinkCampaigns
  filters?: SearchBacklinkCampaigns
  onFiltersChange?: (filters: SearchBacklinkCampaigns) => void
}

export function BacklinkCampaignsFilters({
  defaultFilters, filters, onFiltersChange,
}: BacklinkCampaignsFiltersProps) {
  const t = useTranslations("backlinkCampaigns")

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
      icon: <Filter className="size-4" />,
    },
    {
      label: t("deviceOptions.all"),
      value: "all",
      icon: <Filter className="size-4" />,
    },
  ]

  const StatusOptions = [
    {
      label: t("statusOptions.notStarted"),
      value: CampaignStatus.NOT_STARTED,
    },
    {
      label: t("statusOptions.active"),
      value: CampaignStatus.ACTIVE,
    },
    {
      label: t("statusOptions.paused"),
      value: CampaignStatus.PAUSED,
    },
    {
      label: t("statusOptions.completed"),
      value: CampaignStatus.COMPLETED,
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
        name: "domain",
        title: t("filters.domain"),
        children: ({ field }) => (
          <TextInput
            {...field}
            placeholder={t("filters.enterDomain")}
          />
        ),
      },
      {
        name: "date_range",
        title: t("filters.dateRange"),
        children: ({ field }) => (
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2">{t("filters.startDate")}</p>

              <DayPicker
                mode="single"
                selected={field.value?.start_date ? new Date(field.value.start_date) : undefined}
                onSelect={
                  date => field.onChange({
                    ...field.value,
                    start_date: date?.toISOString() || "",
                  })
                }
                TriggerComponent={
                  (
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 size-4" />

                      {field.value?.start_date ? new Date(field.value.start_date).toLocaleDateString("vi-VN") : t("filters.chooseStartDate")}
                    </Button>
                  )
                }
              />
            </div>

            <div>
              <p className="text-sm mb-2">{t("filters.endDate")}</p>

              <DayPicker
                mode="single"
                selected={field.value?.end_date ? new Date(field.value.end_date) : undefined}
                onSelect={
                  date => field.onChange({
                    ...field.value,
                    end_date: date?.toISOString() || "",
                  })
                }
                TriggerComponent={
                  (
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 size-4" />

                      {field.value?.end_date ? new Date(field.value.end_date).toLocaleDateString("vi-VN") : t("filters.chooseEndDate")}
                    </Button>
                  )
                }
              />
            </div>
          </div>
        ),
      },
    ],
    [t]
  )

  const handleFiltersChange = React.useCallback(
    (updatedFilters: Record<string, unknown>) => {
      if (onFiltersChange) {
        onFiltersChange(updatedFilters as SearchBacklinkCampaigns)
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
