"use client"

import React from "react"

import Image from "next/image"

import {
  type VisibilityState,
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  useTranslations,
} from "next-intl"

import {
  moneyFormat,
} from "~/shared/utils/shared"

import {
  TransactionStatus,
  TransactionType,
  type TransactionFilter,
  type Transaction,
} from "~/features/transaction/type/transaction"
import {
  Link,
} from "~/i18n"
import {
  type BaseDataTableProps,
  DataTable,
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

export interface TransactionHistoryTableProps extends BaseDataTableProps, TableToolbarProps {
  data?: Transaction[]
  filters?: TransactionFilter
  total?: number
  hasSelection?: boolean
  columnVisibility?: VisibilityState
}

export function TransactionHistoryTableAdmin({
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
}: TransactionHistoryTableProps) {
  const t = useTranslations("transaction")

  const getStatusBadge = (status: TransactionStatus) => {
    if (status === TransactionStatus.COMPLETED)
      return (
        <Badge
          variant="outline"
          className="bg-primary/20 text-primary"
        >
          {t("status.pay")}
        </Badge>
      )

    if (status === TransactionStatus.PENDING)
      return (
        <Badge
          variant="outline"
          className="bg-warning/20 text-warning"
        >
          {t("status.refund")}
        </Badge>
      )

    if (status === TransactionStatus.FAILED)
      return (
        <Badge
          variant="outline"
          className="bg-info/20 text-info"
        >
          {t("status.charge")}
        </Badge>
      )
  }

  const getTypeBadge = (type: TransactionType) => {
    if (type === TransactionType.PAY_SERVICE)
      return (
        <Badge
          variant="outline"
          className="bg-accent/20 text-accent"
        >
          {t("type.payService")}
        </Badge>
      )

    if (type === TransactionType.DEPOSIT)
      return (
        <Badge
          variant="outline"
          className="bg-success/20 text-success"
        >
          {t("type.deposit")}
        </Badge>
      )
  }

  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => {
      const selectColumn: ColumnDef<Transaction>[] = hasSelection
        ? []
        : []
      return [
        ...selectColumn,
        {
          header: t("table.transactionId"),
          meta: {
            columnName: t("table.transactionId"),
          },
          accessorKey: "id",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.id}
            </div>
          ),
        },
        {
          header: t("table.user"),
          meta: {
            columnName: t("table.user"),
          },
          accessorKey: "username",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {
                row.original.username ? (
                  <span className="text-xs text-muted-foreground ml-1">
                    (
                    {row.original.username}
                    )
                  </span>
                ) : null
              }
            </div>
          ),
        },
        {
          header: t("table.type"),
          meta: {
            columnName: t("table.type"),
          },
          accessorKey: "type",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {getTypeBadge(row.original.type)}
            </div>
          ),
        },
        {
          header: t("table.campaign"),
          meta: {
            columnName: t("table.campaign"),
          },
          accessorKey: "campaignName",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              <Link
                href={`/transactions/${row.original.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {row.original.campaignName || "-"}
              </Link>
            </div>
          ),
        },
        {
          header: t("table.amount"),
          meta: {
            columnName: t("table.amount"),
          },
          accessorKey: "amount",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center font-semibold">
              <span className="font-medium text-sm flex flex-row items-center gap-2">
                {
                  moneyFormat(
                    row.original.amount, {
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
          header: t("table.status"),
          meta: {
            columnName: t("table.status"),
          },
          accessorKey: "status",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {getStatusBadge(row.original.status)}
            </div>
          ),
        },
        {
          header: t("table.date"),
          meta: {
            columnName: t("table.date"),
          },
          accessorKey: "createdAt",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {
                new Date(row.original.createdAt).toLocaleDateString(
                  "vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
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
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
    </TableContainer>
  )
}
