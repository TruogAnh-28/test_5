"use client"

import React from "react"

import Image from "next/image"

import {
  type VisibilityState, type ColumnDef, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
// import {
//   Calendar, Globe, Laptop, Smartphone, Tablet, ExternalLink,
// } from "lucide-react"
import {
  Pause, Calendar, Globe, Laptop, Smartphone, Tablet, ExternalLink,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  moneyFormat,
} from "~/shared/utils/shared"

import {
  pausedTrafficCampaign,
} from "~/features/traffic-seo-campaigns/api/traffic-seo-campaigns"
import {
  TrafficSeoCampaignsFilters,
} from "~/features/traffic-seo-campaigns/components/filters/traffic-seo-campaigns-filters"
import {
  CampaignStatus,
  type SearchTrafficSeoCampaigns, type TrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  Link,
} from "~/i18n"
import {
  confirmAlert,
} from "~/shared/components/dialogs/use-confirm-alert"
import {
  type BaseDataTableProps, DataTable,
} from "~/shared/components/tables/data-table"
import {
  TableContainer,
} from "~/shared/components/tables/table-container"
import {
  TablePagination,
} from "~/shared/components/tables/table-pagination"
import {
  TableToolbar,
  type TableToolbarProps,
} from "~/shared/components/tables/table-toolbar"
import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "~/shared/components/ui/tooltip"

const formatDate = (date: Date | string) => {
  if (!date) return "N/A"
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString(
    "vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  )
}

const DeviceIcon = ({ device }: { device: string }) => {
  if (device === "Desktop") {
    return <Laptop className="size-4" />
  }
  if (device === "Mobile") {
    return <Smartphone className="size-4" />
  }
  if (device === "Tablet") {
    return <Tablet className="size-4" />
  }
  return <Globe className="size-4" />
}

export interface TrafficSeoCampaignsTableProps extends BaseDataTableProps, TableToolbarProps {
  data?: TrafficSeoCampaigns[]
  onPauseSuccess?: () => void
  filters?: SearchTrafficSeoCampaigns
  total?: number
  hasSelection?: boolean
  columnVisibility?: VisibilityState
}

export function TrafficSeoCampaignsTable({
  data, filters, total, onFiltersChange, onFilterClick, onPauseSuccess, hasSelection, FiltersComponent, hasFilters, hasReset, columnVisibility: columnVisibilityProp, ...props
}: TrafficSeoCampaignsTableProps) {
  const t = useTranslations("trafficSeoCampaigns")
  const StatusBadge = ({ status }: { status: string }) => {
    let variant: "default" | "destructive" | "outline" | "secondary" = "outline"
    let label = status
    let customClasses = ""

    if (status === CampaignStatus.ACTIVE) {
      variant = "default"
      label = t("statusOptions.active")
      customClasses = "bg-green-100 text-green-800 border-green-200 font-medium hover:text-white"
    }
    if (status === CampaignStatus.PAUSED) {
      variant = "default"
      label = t("statusOptions.paused")
      customClasses = "bg-yellow-100 text-yellow-800 border-yellow-200 font-medium hover:text-white"
    }
    if (status === CampaignStatus.NOT_STARTED) {
      variant = "default"
      label = t("statusOptions.notStarted")
      customClasses = "bg-gray-100 text-gray-800 border-gray-200 font-medium hover:text-white"
    }
    if (status === CampaignStatus.CANCEL) {
      variant = "default"
      label = t("statusOptions.cancel")
      customClasses = "bg-red-100 text-red-800 border-red-200 font-medium hover:text-white"
    }
    if (status === CampaignStatus.COMPLETED) {
      variant = "default"
      label = t("statusOptions.completed")
      customClasses = "bg-blue-100 text-blue-800 border-blue-200 font-medium hover:text-white"
    }
    return (
      <Badge
        variant={variant}
        className={customClasses}
      >
        {label}
      </Badge>
    )
  }

  const columns = React.useMemo<ColumnDef<TrafficSeoCampaigns>[]>(
    () => {
      const selectColumn: ColumnDef<TrafficSeoCampaigns>[] = hasSelection
        ? []
        : []
      return [
        ...selectColumn,
        {
          header: t("form.name"),
          meta: {
            columnName: t("form.name"),
          },
          accessorKey: "name",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              <Link
                href={`/traffic-seo-campaigns/${row.original.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {row.original.name}
              </Link>
            </div>
          ),
        },
        {
          header: t("form.domain"),
          meta: {
            columnName: t("form.domain"),
          },
          accessorKey: "domain",
          cell: ({ row }) => (
            <div className="flex gap-2 items-center">
              <Globe className="size-4 text-muted-foreground" />

              <a
                href={`https://${row.original.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 max-w-[150px]"
                title={row.original.domain}
              >
                <span className="truncate">{row.original.domain}</span>

                <ExternalLink className="size-3 shrink-0" />
              </a>
            </div>
          ),
        },
        {
          header: t("form.device"),
          meta: {
            columnName: t("form.device"),
          },
          accessorKey: "device",
          cell: ({ row }) => (
            <div className="flex gap-2 items-center">
              <DeviceIcon device={row.original.device} />

              <span>
                {row.original.device}
              </span>
            </div>
          ),
        },
        {
          header: t("form.totalTraffic"),
          meta: {
            columnName: t("form.totalTraffic"),
          },
          accessorKey: "totalTraffic",
          cell: ({ row }) => (
            <div className="font-medium">
              {row.original.totalTraffic.toLocaleString()}
            </div>
          ),
        },
        {
          header: t("form.cost"),
          meta: {
            columnName: t("form.cost"),
          },
          accessorKey: "cost",
          cell: ({ row }) => (
            <div className="font-medium">
              <span className="font-medium text-sm flex flex-row items-center gap-2">
                {
                  moneyFormat(
                    row.original.totalCost, {
                      suffix: "",
                    }
                  )
                }

                <Image
                  src="/images/logo/logo_1.png"
                  alt="Auto Ranker"
                  width={15}
                  height={15}
                />
              </span>
            </div>
          ),
        },
        {
          header: t("filters.dateRange"),
          meta: {
            columnName: t("filters.dateRange"),
          },
          accessorKey: "startDate",
          cell: ({ row }) => (
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-xs">
                <Calendar className="size-3 text-muted-foreground" />

                <span>
                  {t("filters.startDate")}

                  {formatDate(row.original.startDate)}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs mt-1">
                <Calendar className="size-3 text-muted-foreground" />

                <span>
                  {t("filters.endDate")}

                  {formatDate(row.original.endDate)}
                </span>
              </div>
            </div>
          ),
        },
        {
          header: t("filters.status"),
          meta: {
            columnName: t("filters.status"),
          },
          accessorKey: "status",
          cell: ({ row }) => (
            <StatusBadge status={row.original.status} />
          ),
        },

        {
          id: "actions",
          header: () => <p className="text-center">{t("action.action")}</p>,
          meta: {
            columnName: t("action.action"),
            allowClick: false,
          },
          maxSize: 70,
          enableHiding: false,
          cell: ({ row }) => (
            <TooltipProvider delayDuration={100}>
              <div className="flex gap-1 justify-center">
                {
                  (row.original.status === CampaignStatus.NOT_STARTED || row.original.status === CampaignStatus.ACTIVE) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={
                            () =>
                              confirmAlert({
                                onAction: () =>
                                  pausedTrafficCampaign(row.original.id),
                                onActionSuccess: onPauseSuccess,
                                document: {
                                  title: t("action.pauseCampaign"),
                                  descriptions: t("action.pauseConfirm"),
                                  action: t("action.pause"),
                                },
                              })
                          }
                          title={t("action.pause")}
                          variant="ghost"
                          size="icon"
                          className="size-8 hover:text-yellow-600 hover:bg-yellow-100 hover:dark:bg-yellow-800 hover:dark:text-yellow-300"
                        >
                          <Pause className="size-4" />
                        </Button>
                      </TooltipTrigger>

                      <TooltipContent>{t("action.pause")}</TooltipContent>
                    </Tooltip>
                  )
                }
              </div>
            </TooltipProvider>
          ),
        },
      ]
    },
    []
  )

  const [
    columnVisibility,
    setColumnVisibility,
  ] = React.useState<VisibilityState>(columnVisibilityProp ?? {
  })

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnPinning: {
        right: ["actions"],
      },
    },
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    columns: columns,
    data: data ?? [],
    getRowId: (originalRow) => {
      return originalRow.id.toString()
    },
  })

  const filtersComponentToRender = FiltersComponent || (
    <TrafficSeoCampaignsFilters
      defaultFilters={filters}
      filters={filters}
      onFiltersChange={onFiltersChange}
    />
  )

  return (
    <TableContainer>
      <TableToolbar
        table={table}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onFilterClick={onFilterClick}
        FiltersComponent={filtersComponentToRender}
        hasFilters={hasFilters}
        hasReset={hasReset}
      />

      <DataTable
        table={table}
        {...props}
      />

      <TablePagination
        table={table}
        total={total}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
    </TableContainer>
  )
}
