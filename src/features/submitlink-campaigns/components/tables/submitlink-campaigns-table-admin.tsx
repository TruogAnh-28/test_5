"use client"

import React from "react"

import Image from "next/image"

import {
  type VisibilityState, type ColumnDef, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
import {
  Calendar, Link as LinkIcon,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  moneyFormat,
} from "~/shared/utils/shared"

import {
  SubmitlinkCampaignsFilters,
} from "~/features/submitlink-campaigns/components/filters/submitlink-campaigns-filters"
import {
  CampaignStatus,
  type SearchSubmitlinkCampaigns, type SubmitlinkCampaigns,
} from "~/features/submitlink-campaigns/type/submitlink-campaigns"
import {
  Link,
} from "~/i18n"
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

export interface SubmitlinkCampaignsTableAdminProps extends BaseDataTableProps, TableToolbarProps {
  data?: SubmitlinkCampaigns[]
  onDeleteSuccess?: () => void
  filters?: SearchSubmitlinkCampaigns
  total?: number
  hasSelection?: boolean
  columnVisibility?: VisibilityState
}

export function SubmitlinkCampaignsTableAdmin({
  data, filters, total, onFiltersChange, onFilterClick, hasSelection, FiltersComponent, hasFilters, hasReset, columnVisibility: columnVisibilityProp, ...props
}: SubmitlinkCampaignsTableAdminProps) {
  const t = useTranslations("submitlinkCampaigns")
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
  const columns = React.useMemo<ColumnDef<SubmitlinkCampaigns>[]>(
    () => {
      const selectColumn: ColumnDef<SubmitlinkCampaigns>[] = hasSelection
        ? []
        : []
      return [
        ...selectColumn,
        {
          header: t("form.user"),
          meta: {
            columnName: t("form.user"),
          },
          accessorKey: "username",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.username || "N/A"}
            </div>
          ),
        },
        {
          header: t("form.name"),
          meta: {
            columnName: t("form.name"),
          },
          accessorKey: "name",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              <Link
                href={`/submitlink-campaigns/${row.original.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {row.original.name}
              </Link>
            </div>
          ),
        },
        {
          header: t("form.links.count"),
          meta: {
            columnName: t("form.links.count"),
          },
          accessorKey: "links",
          cell: ({ row }) => (
            <div className="flex gap-2 items-center">
              <LinkIcon className="size-4 text-muted-foreground" />

              <span>
                {row.original.links?.length || 0}
              </span>
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
    <SubmitlinkCampaignsFilters
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
