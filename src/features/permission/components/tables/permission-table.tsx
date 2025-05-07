"use client"

import React from "react"

import {
  type VisibilityState, type ColumnDef, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
import {
  Edit2, Trash,
} from "lucide-react"

import {
  deletePermission,
} from "~/features/permission/api/permission"
import {
  type SearchPermissions, type Permission,
} from "~/features/permission/type/permission"
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
  Button,
} from "~/shared/components/ui/button"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "~/shared/components/ui/tooltip"

export interface PermissionsTableProps extends BaseDataTableProps, TableToolbarProps {
  data?: Permission[]
  onDeleteSuccess?: () => void
  filters?: SearchPermissions
  total?: number

  hasSelection?: boolean
  columnVisibility?: VisibilityState
}

export function PermissionsTable({
  data, filters, total, onFiltersChange, onFilterClick, onDeleteSuccess, hasSelection, FiltersComponent, hasFilters, hasReset, columnVisibility: columnVisibilityProp, ...props
}: PermissionsTableProps) {
  const columns = React.useMemo<ColumnDef<Permission>[]>(
    () => {
      const selectColumn: ColumnDef<Permission>[] = hasSelection
        ? []
        : []
      return [
        ...selectColumn,
        {
          header: "Mã quyền",
          meta: {
            columnName: "Mã quyền",
          },
          accessorKey: "code",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">

              {row.original.code}

            </div>
          ),
        },
        {
          header: "Tên quyền",
          meta: {
            columnName: "Tên quyền",
          },
          accessorKey: "name",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">

              {row.original.name}

            </div>
          ),
        },

        {
          id: "actions",
          header: () => <p className="text-center">Tùy chỉnh</p>,
          meta: {
            columnName: "Tùy chỉnh",
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
                      title="Sửa"
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 hover:text-destructive hover:bg-destructive/20 hover:dark:bg-destructive hover:dark:text-white"
                    >
                      <Link href={`/permissions/${row.original.id}`}>
                        <Edit2 />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Sửa</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={
                        () =>
                          confirmAlert({
                            onAction: () =>
                              deletePermission(row.original.id,),
                            onActionSuccess: onDeleteSuccess,
                          })
                      }
                      title="Xóa"
                      variant="ghost"
                      size="icon"
                      className="size-8 hover:text-destructive hover:bg-destructive/20 hover:dark:bg-destructive hover:dark:text-white"
                    >
                      <Trash />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Xóa</TooltipContent>
                </Tooltip>
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
