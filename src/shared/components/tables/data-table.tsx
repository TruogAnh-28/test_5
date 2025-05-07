import React from "react"

import {
  type Table as ITable, type Row, type RowData,
} from "@tanstack/react-table"

import {
  ErrorMessage,
} from "~/shared/components/shared/error-message"
import {
  ReactTable,
  Table, TableBody, TableCell, TableRowExpanded, TableHead, TableHeader, TableHeadGroup, TableRow, TableBodyEmpty,
  type TableExpandedRowProps,
  TableFooter,
} from "~/shared/components/tables/react-table"
import {
  Spin,
} from "~/shared/components/ui/spinner"
import {
  cn,
} from "~/shared/utils"

export interface BaseDataTableProps {
  isLoading?: boolean
  className?: string
  error?: Error | null
  emptyMessage?: string
  FooterComponent?: React.ReactNode
}

export interface DataTableProps<T extends RowData> extends BaseDataTableProps {
  ExpandedComponent?: TableExpandedRowProps<T>["children"]
  onRowClick?: (row: Row<T>) => void
  table: ITable<T>
}

export function DataTable<T>({
  className, ExpandedComponent, onRowClick, error, isLoading, table, emptyMessage = "Không tìm thấy kết quả nào!", FooterComponent,
}: DataTableProps<T>) {
  return (
    <div className={
      cn(
        "md:max-h-[72vh] w-full overflow-auto flex-1", className
      )
    }
    >
      <ReactTable table={table}>
        <Table className="text-sm">
          <TableHeader className="h-12 sticky top-0 z-10 border-b bg-background shadow-[0px_-3px_3px_-3px_hsl(var(--border))_inset]">
            <TableHeadGroup>
              <TableHead className="p-2 text-left align-middle font-semibold data-[pinned=true]:bg-background hover:bg-muted hover:data-[pinned=true]:bg-muted" />
            </TableHeadGroup>
          </TableHeader>

          <TableBodyEmpty>
            {
              isLoading ? (
                <div className="grid place-content-center py-6">
                  <Spin />
                </div>
              ) : error ? (
                <div className="grid place-content-center py-6">
                  <ErrorMessage error={error} />
                </div>
              ) : (
                <div className="grid place-content-center py-6">
                  <ErrorMessage message={emptyMessage} />
                </div>
              )
            }
          </TableBodyEmpty>

          <TableBody>
            {
              (row: Row<T>) => (
                <React.Fragment>
                  <TableRow
                    row={row}
                    className="group/tableRow border-b hover:bg-muted/10 hover:text-muted-foreground bg-background aria-[selected=true]:bg-muted"
                  >
                    {
                      (cell) => {
                        const allowClick = cell.column.columnDef.meta?.allowClick ?? true
                        return (
                          <TableCell
                            cell={cell}
                            className={
                              cn(
                                "p-2 align-middle group-hover/tableRow:border-secondary group-hover/tableRow:!bg-accent/80 data-[pinned=true]:bg-background group-aria-[selected=true]/tableRow:!bg-light-primary group-aria-[selected=true]/tableRow:!text-primary", allowClick && onRowClick && "cursor-pointer"
                              )
                            }
                            onClick={
                              () => {
                                if (allowClick && onRowClick instanceof Function) {
                                  onRowClick?.(row)
                                }
                              }
                            }
                          />
                        )
                      }
                    }
                  </TableRow>

                  <TableRowExpanded row={row}>{ExpandedComponent}</TableRowExpanded>
                </React.Fragment>
              )
            }
          </TableBody>

          {
            FooterComponent ? (
              <TableFooter>
                {FooterComponent}
              </TableFooter>
            ) : null
          }
        </Table>
      </ReactTable>
    </div>
  )
}
