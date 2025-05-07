"use client"

import React from "react"

import {
  type VisibilityState, type ColumnDef, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
import {
  Edit2, Trash,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  deleteUser,
} from "~/features/user/api/user"
import {
  type SearchUsers, type User,
} from "~/features/user/type/user"
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
  TableToolbar, type TableToolbarProps,
} from "~/shared/components/tables/table-toolbar"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "~/shared/components/ui/tooltip"

export interface UsersTableProps extends BaseDataTableProps, TableToolbarProps {
  data?: User[]
  onDeleteSuccess?: () => void
  filters?: SearchUsers
  total?: number
  hasSelection?: boolean
  columnVisibility?: VisibilityState
}

export function UsersTable({
  data,
  filters,
  total,
  onFiltersChange,
  onDeleteSuccess,
  onFilterClick,
  hasSelection,
  FiltersComponent,
  hasFilters,
  hasReset,
  columnVisibility: columnVisibilityProp,
  ...props
}: UsersTableProps) {
  const t = useTranslations("user")

  const columns = React.useMemo<ColumnDef<User>[]>(
    () => {
      const selectColumn: ColumnDef<User>[] = hasSelection ? [] : []

      return [
        ...selectColumn,
        {
          header: t("table.fullName"),
          meta: {
            columnName: t("table.fullName"),
          },
          accessorKey: "name",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.username}
            </div>
          ),
        },
        {
          header: t("table.email"),
          meta: {
            columnName: t("table.email"),
          },
          accessorKey: "email",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {row.original.email}
            </div>
          ),
        },
        {
          header: t("table.role"),
          meta: {
            columnName: t("table.role"),
          },
          accessorKey: "role_id",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">
              {
                row.original.role.id === 1
                  ? t("form.roleOptions.admin")
                  : t("form.roleOptions.client")
              }
            </div>
          ),
        },
        {
          id: "actions",
          header: () => <p className="text-center">{t("table.actions")}</p>,
          meta: {
            columnName: t("table.actions"),
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
                      title={t("table.edit")}
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 hover:text-destructive hover:bg-destructive/20 hover:dark:bg-destructive hover:dark:text-white"
                    >
                      <Link href={`/users/${row.original.id}`}>
                        <Edit2 className="size-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>{t("table.edit")}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={
                        () =>
                          confirmAlert({
                            onAction: () => deleteUser(row.original.id),
                            onActionSuccess: onDeleteSuccess,
                            document: {
                              title: t("table.deleteConfirm.title"),
                              descriptions: t("table.deleteConfirm.description"),
                              action: t("table.deleteConfirm.action"),
                            },
                          })
                      }
                      title={t("table.delete")}
                      variant="ghost"
                      size="icon"
                      className="size-8 hover:text-destructive hover:bg-destructive/20 hover:dark:bg-destructive hover:dark:text-white"
                    >
                      <Trash className="size-4" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>{t("table.delete")}</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          ),
        },
      ]
    },
    [t]
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
