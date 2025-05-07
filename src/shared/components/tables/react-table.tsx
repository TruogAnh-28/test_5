/* eslint-disable react/boolean-prop-naming */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable custom-rules/encourage-object-params */
"use client"

import React from "react"

import {
  flexRender,
  type Cell,
  type Column,
  type Header,
  type HeaderGroup,
  type Row,
  type RowData,
  type Table as ITable,
} from "@tanstack/react-table"

import {
  cn,
} from "~/shared/utils"

// Config
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue>
    extends Record<string, unknown> {
    columnName?: string
  }
}

// utils
type ChildrenRenderer<C, P> = C | ((props: P) => C)

function rendererChildren<C extends React.ReactNode, P>(
  children: ChildrenRenderer<C, P>,
  props: P,
) {
  if (children instanceof Function) {
    return children(props)
  }
  return children
}

function isReactFragment<E extends React.ReactElement>(element: E) {
  if (element.type) {
    return element.type === React.Fragment
  }
  return element instanceof React.Fragment
}

function clonerElement<E extends React.ReactElement, P>(
  element: E, props: P
) {
  if (React.isValidElement(element) && !isReactFragment(element)) {
    return React.cloneElement(
      element, props as React.Attributes
    )
  }
  return element
}

function handleCellStyling<T extends RowData>(
  column: Column<T>,
  style?: React.CSSProperties,
) {
  const isPinned = column.getIsPinned()

  return {
    boxShadow: isPinned
      ? isPinned === "right"
        ? "3px 0 3px -3px hsl(var(--border)) inset"
        : "-3px 0 3px -3px hsl(var(--border)) inset"
      : undefined,
    maxWidth:
      column.columnDef.maxSize === Number.MAX_SAFE_INTEGER
        ? undefined
        : column.columnDef.maxSize,
    minWidth: column.columnDef.minSize ?? undefined,
    position: isPinned ? "sticky" : undefined,
    right: isPinned === "right" ? column.getAfter("right") : undefined,
    left: isPinned === "left" ? column.getStart("left") : undefined,
    zIndex: isPinned ? 1 : undefined,
    ...style,
  } as React.CSSProperties
}

// React Table
type ReactTableContextProps = ITable<RowData>

const ReactTableContext = React.createContext<ReactTableContextProps | null>(null,)

export function useReactTableContext<T extends RowData>() {
  const context = React.useContext(ReactTableContext)
  if (!context) {
    throw new Error("useReactTableContext must be used within a ReactTable")
  }
  return context as ITable<T>
}

export interface ReactTableProps<T extends RowData> {
  children: React.ReactNode
  table: ITable<T>
}

function ReactTable<T>({
  children, table,
}: ReactTableProps<T>) {
  return (
    <ReactTableContext.Provider value={table as ITable<RowData>}>
      {children}
    </ReactTableContext.Provider>
  )
}

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>((
  {
    className, ...props
  }, ref
) => {
  return (
    <table
      className={
        cn(
          "w-full border-collapse text-sm", className
        )
      }
      ref={ref}
      {...props}
    />
  )
})
Table.displayName = "Table"

interface TableHeaderProps<T extends RowData>
  extends Omit<React.HTMLAttributes<HTMLTableSectionElement>, "children"> {
  children?: ChildrenRenderer<React.ReactElement, HeaderGroup<T>>
  asFragment?: boolean
}

function TableHeader<T>({
  children, className, asFragment, ...props
}: TableHeaderProps<T>) {
  const table = useReactTableContext<T>()
  const Comp = asFragment ? (
    <React.Fragment />
  ) : (
    <thead
      className={
        cn(
          "text-left", className
        )
      }
      {...props}
    />
  )
  return React.cloneElement(
    Comp,
    undefined,
    table.getHeaderGroups().map(headerGroup => (
      <React.Fragment key={headerGroup.id}>
        {
          clonerElement(
            rendererChildren(
              children, headerGroup
            )!, {
              headerGroup,
            }
          )
        }
      </React.Fragment>
    ))
  )
}
TableHeader.displayName = "TableHeader"

interface TableHeaderRow<T extends RowData>
  extends Omit<React.HTMLAttributes<HTMLTableRowElement>, "children"> {
  headerGroup?: HeaderGroup<T>
  children?: ChildrenRenderer<React.ReactElement, Header<T, unknown>>
}

function TableHeadGroup<T>({
  headerGroup, children, ...props
}: TableHeaderRow<T>) {
  return (
    <tr
      {...props}
    >
      {
        headerGroup?.headers.map(header => (
          <React.Fragment key={header.id}>
            {
              clonerElement(
                rendererChildren(
                  children, header
                )!, {
                  header,
                }
              )
            }
          </React.Fragment>
        ))
      }
    </tr>
  )
}
TableHeadGroup.displayName = "TableHeadGroup"

interface TableHeadProps<T extends RowData>
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  header?: Header<T, unknown>
}

function TableHead<T>({
  header, style, ...props
}: TableHeadProps<T>) {
  if (!header) {
    return null
  }
  return (
    <th
      colSpan={header.column.getIsPinned() ? 0 : header.colSpan}
      data-pinned={!!header.column.getIsPinned()}
      style={
        handleCellStyling(
          header.column, style
        )
      }
      {...props}
    >
      {
        header.isPlaceholder
          ? null
          : flexRender(
            header.column.columnDef.header, header.getContext()
          )
      }
    </th>
  )
}
TableHead.displayName = "TableHead"

interface TableBodyProps<T extends RowData>
  extends Omit<React.HTMLAttributes<HTMLTableSectionElement>, "children"> {
  children?: ChildrenRenderer<React.ReactElement, Row<T>>
  asFragment?: boolean
}

function TableBody<T>({
  children, asFragment, ...props
}: TableBodyProps<T>) {
  const table = useReactTableContext<T>()
  const rows = table.getRowModel().rows
  const Comp = asFragment ? <React.Fragment /> : (
    <tbody
      {...props}
    />
  )
  if (!rows.length) {
    return null
  }
  return React.cloneElement(
    Comp,
    undefined,
    rows.map(row => (
      <React.Fragment key={row.id}>
        {
          clonerElement(
            rendererChildren(
              children, row
            )!, {
              row,
            }
          )
        }
      </React.Fragment>
    ))
  )
}
TableBody.displayName = "TableBody"

function TableBodyEmpty({
  children,
  ...props
}: React.ComponentProps<typeof TableCellColSpanAll>) {
  const table = useReactTableContext()
  const rows = table.getRowModel().rows
  if (!rows.length) {
    return (
      <tbody>
        <tr>
          <TableCellColSpanAll {...props}>
            {
              rendererChildren(
                children, table
              )
            }
          </TableCellColSpanAll>
        </tr>
      </tbody>
    )
  }
  return null
}

interface TableRowProps<T extends RowData>
  extends Omit<React.HTMLAttributes<HTMLTableRowElement>, "children"> {
  row?: Row<T>
  children?: ChildrenRenderer<React.ReactElement, Cell<T, unknown>>
}

function TableRow<T>({
  row, children, ...props
}: TableRowProps<T>) {
  if (!row) {
    return null
  }
  return (
    <tr
      data-even={typeof row?.index === "number" ? row?.index % 2 !== 0 : undefined}
      aria-selected={row?.getIsSelected()}
      {...props}
    >
      {
        row?.getVisibleCells().map(cell => (
          <React.Fragment key={cell.id}>
            {
              clonerElement(
                rendererChildren(
                  children as React.ReactElement, cell
                ), {
                  cell,
                }
              )
            }
          </React.Fragment>
        ))
      }
    </tr>
  )
}
TableRow.displayName = "TableRow"

interface TableCellProps<T extends RowData>
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  cell?: Cell<T, unknown>
}

function TableCell<T>({
  cell, style, ...props
}: TableCellProps<T>) {
  if (!cell) {
    return null
  }
  return (
    <td
      data-pinned={!!cell.column.getIsPinned()}
      style={
        handleCellStyling(
          cell.column, style
        )
      }
      {...props}
    >
      {
        flexRender(
          cell.column.columnDef.cell, cell.getContext()
        )
      }
    </td>
  )
}
TableCell.displayName = "TableCell"

interface TableCellFullProps<T extends RowData>
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, "children"> {
  children?: ChildrenRenderer<React.ReactNode, ITable<T>>
}

function TableCellColSpanAll<T>({
  children, ...props
}: TableCellFullProps<T>) {
  const table = useReactTableContext<T>()
  return (
    <td
      colSpan={table.getAllLeafColumns().length}
      {...props}
    >
      {
        rendererChildren(
          children, table
        )
      }
    </td>
  )
}
TableCellColSpanAll.displayName = "TableCellColSpanAll"

export interface TableExpandedRowProps<T extends RowData>
  extends Omit<React.ComponentProps<typeof TableCellColSpanAll>, "children"> {
  row?: Row<T>
  children?: ChildrenRenderer<React.ReactElement, Row<T>>
}

function TableRowExpanded<T>({
  row,
  children,
  ...props
}: TableExpandedRowProps<T>) {
  if (row?.getIsExpanded()) {
    return (
      <tr>
        <TableCellColSpanAll {...props}>
          {
            rendererChildren(
              children, row
            )
          }
        </TableCellColSpanAll>
      </tr>
    )
  }
  return null
}

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>((
  {
    className, ...props
  }, ref
) => {
  return (
    <tfoot
      ref={ref}
      className={
        cn(
          "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
          className,
        )
      }
      {...props}
    />
  )
})
TableFooter.displayName = "TableFooter"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>((
  {
    className, ...props
  }, ref
) => (
  <caption
    className={
      cn(
        "text-sm text-muted-foreground", className
      )
    }
    ref={ref}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  ReactTable,
  Table,
  TableBody,
  TableBodyEmpty,
  TableCaption,
  TableCell,
  TableCellColSpanAll,
  TableFooter,
  TableHead,
  TableHeader,
  TableHeadGroup,
  TableRow,
  TableRowExpanded,
}
