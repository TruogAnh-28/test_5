"use client"

import React from "react"

import {
  type VisibilityState, type ColumnDef, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
import {
  Edit2, Trash,
} from "lucide-react"

import {
  deleteRole,
} from "~/features/role/api/role"
import {
  UpdateRolePermissionForm,
} from "~/features/role/components/forms/update-role-permission-form"
import {
  type SearchRoles, type Role,
} from "~/features/role/type/role"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/components/ui/dialog"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "~/shared/components/ui/tooltip"

export interface RolesTableProps extends BaseDataTableProps, TableToolbarProps {
  data?: Role[]
  onDeleteSuccess?: () => void
  filters?: SearchRoles
  total?: number

  hasSelection?: boolean
  columnVisibility?: VisibilityState
}

export function RolesTable({
  data, filters, total, onFiltersChange, onFilterClick, onDeleteSuccess, hasSelection, FiltersComponent, hasFilters, hasReset, columnVisibility: columnVisibilityProp, ...props
}: RolesTableProps) {
  const columns = React.useMemo<ColumnDef<Role>[]>(
    () => {
      const selectColumn: ColumnDef<Role>[] = hasSelection
        ? []
        : []
      return [
        ...selectColumn,
        {
          header: "Mã chức vụ",
          meta: {
            columnName: "Mã chức vụ",
          },
          accessorKey: "id",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">

              {row.original.id}

            </div>
          ),
        },
        {
          header: "Tên chức vụ",
          meta: {
            columnName: "Tên chức vụ",
          },
          accessorKey: "name",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">

              {row.original.name}

            </div>
          ),
        },

        {
          header: "Danh sách quyền",
          meta: {
            columnName: "Danh sách quyền",
          },
          accessorKey: "name",
          cell: ({ row }) => (
            <div className="flex gap-3 items-center">

              <Dialog>
                <DialogTrigger className="">
                  <Button
                    variant="outline"
                    className="hover:text-white"
                  >
                    {row.original.permissions_count}

                    {" "}
                    quyền
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Chỉnh sửa quyền của

                      {" "}

                      {row.original.name}
                    </DialogTitle>

                    <DialogDescription>
                      <UpdateRolePermissionForm role_id={row.original.id} />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

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
                      <Link href={`/roles/${row.original.id}`}>
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
                              deleteRole(row.original.id,),
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
