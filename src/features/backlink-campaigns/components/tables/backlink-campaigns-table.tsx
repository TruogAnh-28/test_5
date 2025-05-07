"use client"

import React from "react"

import {
  type VisibilityState, type ColumnDef, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
import {
  Edit2, Trash, Calendar, Globe, Laptop, Smartphone, Tablet, ExternalLink,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  deleteBacklinkCampaigns,
} from "~/features/backlink-campaigns/api/backlink-campaigns"
import {
  BacklinkCampaignsFilters,
} from "~/features/backlink-campaigns/components/filters/backlink-campaigns-filters"
import {
  CampaignStatus,
  type SearchBacklinkCampaigns, type BacklinkCampaigns,
} from "~/features/backlink-campaigns/type/backlink-campaigns"
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

const StatusBadge = ({ status }: { status: string }) => {
  const t = useTranslations("backlinkCampaigns.statusOptions")
  let variant: "default" | "destructive" | "outline" | "secondary" = "outline"
  let label = status

  if (status === CampaignStatus.ACTIVE) {
    variant = "default"
    label = t("active")
  }
  if (status === CampaignStatus.PAUSED) {
    variant = "secondary"
    label = t("paused")
  }
  if (status === CampaignStatus.NOT_STARTED) {
    variant = "outline"
    label = t("notStarted")
  }
  if (status === CampaignStatus.COMPLETED) {
    variant = "default"
    label = t("completed")
  }

  return <Badge variant={variant}>{label}</Badge>
}

const DeviceIcon = ({ device }: { device: string }) => {
  if (device === "desktop") {
    return <Laptop className="size-4" />
  }
  if (device === "mobile") {
    return <Smartphone className="size-4" />
  }
  if (device === "tablet") {
    return <Tablet className="size-4" />
  }
  return <Globe className="size-4" />
}

export interface BacklinkCampaignsTableProps extends BaseDataTableProps, TableToolbarProps {
  data?: BacklinkCampaigns[]
  onDeleteSuccess?: () => void
  filters?: SearchBacklinkCampaigns
  total?: number
  hasSelection?: boolean
  columnVisibility?: VisibilityState
}

export function BacklinkCampaignsTable({
  data, filters, total, onFiltersChange, onDeleteSuccess, onFilterClick, hasSelection, FiltersComponent, hasFilters, hasReset, columnVisibility: columnVisibilityProp, ...props
}: BacklinkCampaignsTableProps) {
  const tTable = useTranslations("backlinkCampaigns.table")
  const tAction = useTranslations("backlinkCampaigns.action")
  const tDevice = useTranslations("backlinkCampaigns.deviceOptions")
  const tDeleteDialog = useTranslations("backlinkCampaigns.deleteDialog")

  const columns = React.useMemo<ColumnDef<BacklinkCampaigns>[]>(
    () => {
      const selectColumn: ColumnDef<BacklinkCampaigns>[] = hasSelection
        ? []
        : []
      return [
        ...selectColumn,
        {
          header: tTable("campaignName"),
          meta: {
            columnName: tTable("campaignName"),
          },
          accessorKey: "name",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              <Link
                href={`/backlink-campaigns/${row.original.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {row.original.name}
              </Link>
            </div>
          ),
        },
        {
          header: tTable("domain"),
          meta: {
            columnName: tTable("domain"),
          },
          accessorKey: "domain",
          cell: ({ row }) => (
            <div className="flex gap-2 items-center">
              <Globe className="size-4 text-muted-foreground" />

              <a
                href={`https://${row.original.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                {row.original.domain}

                <ExternalLink className="size-3" />
              </a>
            </div>
          ),
        },
        {
          header: tTable("device"),
          meta: {
            columnName: tTable("device"),
          },
          accessorKey: "device",
          cell: ({ row }) => (
            <div className="flex gap-2 items-center">
              <DeviceIcon device={row.original.device} />

              <span>
                {row.original.device === "desktop" && tDevice("desktop")}

                {row.original.device === "mobile" && tDevice("mobile")}

                {row.original.device === "tablet" && tDevice("tablet")}

                {row.original.device === "all" && tDevice("all")}
              </span>
            </div>
          ),
        },
        {
          header: tTable("traffic"),
          meta: {
            columnName: tTable("traffic"),
          },
          accessorKey: "totalTraffic",
          cell: ({ row }) => (
            <div className="font-medium">
              {row.original.totalTraffic.toLocaleString()}
            </div>
          ),
        },
        {
          header: tTable("cost"),
          meta: {
            columnName: tTable("cost"),
          },
          accessorKey: "cost",
          cell: ({ row }) => (
            <div className="font-medium">
              {row.original.cost.toLocaleString()}

              {" "}
              đ
            </div>
          ),
        },
        {
          header: tTable("timeframe"),
          meta: {
            columnName: tTable("timeframe"),
          },
          accessorKey: "startDate",
          cell: ({ row }) => (
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-xs">
                <Calendar className="size-3 text-muted-foreground" />

                <span>
                  {tTable("startDate")}

                  {formatDate(row.original.startDate)}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs mt-1">
                <Calendar className="size-3 text-muted-foreground" />

                <span>
                  {tTable("endDate")}

                  {formatDate(row.original.endDate)}
                </span>
              </div>
            </div>
          ),
        },
        {
          header: tTable("status"),
          meta: {
            columnName: tTable("status"),
          },
          accessorKey: "status",
          cell: ({ row }) => (
            <StatusBadge status={row.original.status} />
          ),
        },
        {
          id: "actions",
          header: () => <p className="text-center">{tTable("actions")}</p>,
          meta: {
            columnName: tTable("actions"),
            allowClick: false,
          },
          maxSize: 70,
          enableHiding: false,
          cell: ({ row }) => (
            <TooltipProvider delayDuration={100}>
              <div className="flex gap-1 justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      title={tAction("edit")}
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 hover:text-primary hover:bg-primary/20"
                    >
                      <Link href={`/backlink-campaigns/${row.original.id}`}>
                        <Edit2 className="size-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>{tAction("edit")}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={
                        () =>
                          confirmAlert({
                            onAction: () =>
                              deleteBacklinkCampaigns(row.original.id),
                            onActionSuccess: onDeleteSuccess,
                            document: {
                              title: tDeleteDialog("title"),
                              descriptions: tDeleteDialog("description"),
                              action: tDeleteDialog("action"),
                            },
                          })
                      }
                      title={tAction("delete")}
                      variant="ghost"
                      size="icon"
                      className="size-8 hover:text-destructive hover:bg-destructive/20"
                    >
                      <Trash className="size-4" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>{tAction("delete")}</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          ),
        },
      ]
    },
    [
      onDeleteSuccess,
      tTable,
      tAction,
      tDevice,
      tDeleteDialog,
    ]
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
    <BacklinkCampaignsFilters
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
