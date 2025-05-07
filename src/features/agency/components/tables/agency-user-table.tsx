"use client"

import React from "react"

import {
  type VisibilityState, type ColumnDef, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
import {
  useTranslations,
} from "next-intl"

import {
  moneyFormat,
} from "~/shared/utils/shared"

import {
  type InvitedUsers,
  type ReferralStatus,
} from "~/features/agency/types/agency"
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

export interface AgencyUserTableProps extends BaseDataTableProps, TableToolbarProps {
  data?: InvitedUsers[]
  filters?: {
    key?: string
    status?: ReferralStatus
    page: number
    limit: number
  }
  total?: number
  hasSelection?: boolean
  columnVisibility?: VisibilityState
}

export function AgencyUserTable({
  data,
  filters,
  total,
  onFiltersChange,
  onFilterClick,
  hasSelection,
  FiltersComponent,
  hasFilters,
  hasReset,
  columnVisibility: columnVisibilityProp,
  ...props
}: AgencyUserTableProps) {
  const t = useTranslations("agency")

  const columns = React.useMemo<ColumnDef<InvitedUsers>[]>(
    () => {
      const selectColumn: ColumnDef<InvitedUsers>[] = hasSelection
        ? []
        : []
      return [
        ...selectColumn,
        {
          header: t("stats.table.name"),
          meta: {
            columnName: t("stats.table.name"),
          },
          accessorKey: "userName",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.userName}
            </div>
          ),
        },
        {
          header: t("stats.table.email"),
          meta: {
            columnName: t("stats.table.email"),
          },
          accessorKey: "email",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.email}
            </div>
          ),
        },
        {
          header: t("stats.table.registeredAt"),
          meta: {
            columnName: t("stats.table.registeredAt"),
          },
          accessorKey: "createAt",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
            </div>
          ),
        },
        // {
        //   header: t("stats.table.status"),
        //   meta: {
        //     columnName: t("stats.table.status"),
        //   },
        //   accessorKey: "status",
        //   cell: ({ row }) => (
        //     <div className="flex gap-3 items-center">
        //       {getStatusBadge(ReferralStatus.ACTIVE)}
        //     </div>
        //   ),
        // },
        {
          header: t("stats.table.earnings"),
          meta: {
            columnName: t("stats.table.earnings"),
          },
          accessorKey: "commission",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center font-semibold">
              {
                moneyFormat(
                  row.original.commission || 0, {
                    suffix: " đ",
                  }
                )
              }
            </div>
          ),
        },
      ]
    },
    [
      t,
      hasSelection,
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
        right: [],
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
        // filters={filters}
        onFiltersChange={onFiltersChange}
      />
    </TableContainer>
  )
}
