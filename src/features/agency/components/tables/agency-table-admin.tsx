// src/features/agency/components/tables/agency-table-admin.tsx
"use client"

import React from "react"

import {
  type VisibilityState, type ColumnDef, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
import {
  useTranslations,
} from "next-intl"

import {
  type Agency,
} from "~/features/agency/types/agency"
// import {
//   Link,
// } from "~/i18n"
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
  TableToolbar, type TableToolbarProps,
} from "~/shared/components/tables/table-toolbar"
import {
  Badge,
} from "~/shared/components/ui/badge"

export interface AgencyTableProps extends BaseDataTableProps, TableToolbarProps {
  data?: Agency[]
  onDeleteSuccess?: () => void
  filters?: {
    key?: string
    page: number
    limit: number
  }
  total?: number
  hasSelection?: boolean
  columnVisibility?: VisibilityState
}

export function AgencyTableAdmin({
  data,
  filters,
  total,
  onFiltersChange,
  onDeleteSuccess,
  onFilterClick,
  hasSelection,
  FiltersComponent,
  hasReset,
  columnVisibility: columnVisibilityProp,
  ...props
}: AgencyTableProps) {
  const t = useTranslations("agency")

  const getStatusBadge = (status: number) => {
    if (status === 1)
      return (
        <Badge
          variant="outline"
          className="bg-success/20 text-success"
        >
          {t("status.active")}
        </Badge>
      )

    if (status === 2)
      return (
        <Badge
          variant="outline"
          className="bg-warning/20 text-warning"
        >
          {t("status.pending")}
        </Badge>
      )

    if (status === 3)
      return (
        <Badge
          variant="outline"
          className="bg-destructive/20 text-destructive"
        >
          {t("status.rejected")}
        </Badge>
      )

    if (status === 4)
      return (
        <Badge
          variant="outline"
          className="bg-muted/20 text-muted-foreground"
        >
          {t("status.suspended")}
        </Badge>
      )

    return (
      <Badge
        variant="outline"
      >
        {t("status.unknown")}
      </Badge>
    )
  }

  const columns = React.useMemo<ColumnDef<Agency>[]>(
    () => {
      const selectColumn: ColumnDef<Agency>[] = hasSelection ? [] : []

      return [
        ...selectColumn,
        {
          header: "ID",
          meta: {
            columnName: "ID",
          },
          accessorKey: "id",
          size: 80,
          cell: ({ row }) => (
            <div className="text-center">
              {row.original.id}
            </div>
          ),
        },
        {
          header: t("form.accountHolder"),
          meta: {
            columnName: t("form.accountHolder"),
          },
          accessorKey: "accountHolder",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.accountHolder}
            </div>
          ),
        },
        {
          header: t("form.bankName"),
          meta: {
            columnName: t("form.bankName"),
          },
          accessorKey: "bankName",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.bankName}
            </div>
          ),
        },
        {
          header: t("form.bankAccount"),
          meta: {
            columnName: t("form.bankAccount"),
          },
          accessorKey: "bankAccount",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.bankAccount}
            </div>
          ),
        },
        {
          header: t("referral.inviteCode"),
          meta: {
            columnName: t("referral.inviteCode"),
          },
          accessorKey: "inviteCode",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.inviteCode}
            </div>
          ),
        },
        {
          header: t("stats.table.status"),
          meta: {
            columnName: t("table.status"),
          },
          accessorKey: "status",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center justify-center">
              {getStatusBadge(row.original.status)}
            </div>
          ),
        },
        {
          header: t("stats.table.createdAt"),
          meta: {
            columnName: t("stats.table.createdAt"),
          },
          accessorKey: "createdAt",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
            </div>
          ),
        },
      ]
    },
    [
      t,
      hasSelection,
      onDeleteSuccess,
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

  return (
    <TableContainer>
      <TableToolbar
        table={table}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onFilterClick={onFilterClick}
        FiltersComponent={FiltersComponent}
        hasReset={hasReset}
        hasFilters={false}
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
