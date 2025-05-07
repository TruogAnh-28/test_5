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
  DepositStatus,
  type SearchDeposits,
  type Deposit,
} from "~/features/deposit/type/deposit"
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

export interface DepositsTableProps extends BaseDataTableProps, TableToolbarProps {
  data?: Deposit[]
  filters?: SearchDeposits
  total?: number
  hasSelection?: boolean
  columnVisibility?: VisibilityState
}

export function DepositHistoryTableAdmin({
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
}: DepositsTableProps) {
  const t = useTranslations("deposit")
  const getStatusBadge = (status: DepositStatus) => {
    if (status === DepositStatus.PENDING)
      return (
        <Badge
          variant="outline"
          className="bg-warning/20 text-warning"
        >
          {t("status.pending")}
        </Badge>
      )

    if (status === DepositStatus.COMPLETED)
      return (
        <Badge
          variant="outline"
          className="bg-success/20 text-success"
        >
          {t("status.approved")}
        </Badge>
      )

    if (status === DepositStatus.FAILED)
      return (
        <Badge
          variant="outline"
          className="bg-destructive/20 text-destructive"
        >
          {t("status.rejected")}
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
  const getPaymentMethodBadge = (method: number) => {
    if (method === 1)
      return (
        <Badge
          variant="outline"
          className="bg-info/20 text-info"
        >
          {t("method.USDT")}
        </Badge>
      )

    // if (method === 2)
    //   return (
    //     <Badge
    //       variant="outline"
    //       className="bg-warning/20 text-warning"
    //     >
    //       {t("method.momo")}
    //     </Badge>
    //   )

    if (method === 3)
      return (
        <Badge
          variant="outline"
          className="bg-info/20 text-info"
        >
          {t("method.PayOS")}
        </Badge>
      )
    if (method === 4)
      return (
        <Badge
          variant="outline"
          className="bg-info/20 text-info"
        >
          {t("method.Gift")}
        </Badge>
      )
    return (
      <Badge
        variant="outline"
      >
        {t("method.unknown")}
      </Badge>
    )
  }
  const columns = React.useMemo<ColumnDef<Deposit>[]>(
    () => {
      const selectColumn: ColumnDef<Deposit>[] = hasSelection
        ? []
        : []
      return [
        ...selectColumn,
        {
          header: t("table.depositCode"),
          meta: {
            columnName: t("table.depositCode"),
          },
          accessorKey: "codeTransaction",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.codeTransaction || row.original.orderId || "-"}
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
              {row.original.username || "N/A"}
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
                      suffix: row.original.paymentMethods.unit,
                    }
                  )
                }

                {/* <Image
                  src="/images/logo/logo_1.png"
                  alt="Auto Ranker"
                  width={15}
                  height={15}
                /> */}
              </span>

            </div>
          ),
        },
        {
          header: t("table.method"),
          meta: {
            columnName: t("table.method"),
          },
          accessorKey: "method",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {getPaymentMethodBadge(row.original.paymentMethods.id) || "-"}
            </div>
          ),
        },
        {
          header: t("table.voucherCode"),
          meta: {
            columnName: t("table.voucherCode"),
          },
          accessorKey: "voucherCode",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.voucherCode || t("table.noVoucher")}
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
          header: t("table.createdAt"),
          meta: {
            columnName: t("table.createdAt"),
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
