import React from "react"

import {
  ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import {
  type Table,
} from "@tanstack/react-table"
import {
  useTranslations,
} from "next-intl"

import {
  Combobox,
} from "~/shared/components/inputs/combobox"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  DEFAULT_PAGE_LIMIT,
} from "~/shared/constants"
import {
  cn,
} from "~/shared/utils"

const PAGE_SIZE_OPTIONS = [
  {
    label: "10",
    value: 10,
  },
  {
    label: "20",
    value: 20,
  },
  {
    label: "25",
    value: 25,
  },
  {
    label: "35",
    value: 35,
  },
  {
    label: "50",
    value: 50,
  },
]

export interface TablePaginationProps {
  total?: number
  totalPages?: number
  filters?: Record<string, unknown>
  onFiltersChange?: (value: Record<string, unknown>) => void
}

export function TablePagination<T>({
  total: totalProp = 0, totalPages = 0, table, filters, onFiltersChange,
}: TablePaginationProps & {
  table?: Table<T>
}) {
  const activePage = (filters?.page ?? 1) as number
  const pageSize = (filters?.limit ?? DEFAULT_PAGE_LIMIT) as number

  const pageCount = totalPages > 0 ? totalPages : Math.ceil((totalProp || pageSize) / pageSize)

  const total = Math.max(
    Math.trunc(pageCount), 0
  )

  const setPage = (newPage: number) => {
    const newActivePage = newPage <= 0 ? 1 : Math.min(
      newPage, total
    )
    onFiltersChange?.({
      page: newActivePage,
    })
  }

  const next = () => setPage(activePage + 1)
  const previous = () => setPage(activePage - 1)
  const first = () => setPage(1)
  const last = () => setPage(total)
  const canPrevious = !(activePage === 1)
  const canNext = !(activePage === total)
  const t = useTranslations("common")
  return (
    <div className="flex w-full lg:items-center justify-between gap-3 overflow-auto p-1">
      {
        table ? (
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length}

            {" "}

            {
              table.getFilteredRowModel().rows.length > 1
                ? t("pagesChoosed")
                : t("pageChoosed")
            }

            {" "}
            .
          </div>
        ) : <div />
      }

      <div className="flex lg:items-center gap-3 lg:gap-6">
        <div className={cn("flex lg:items-center space-x-2")}>
          <p className="text-sm text-muted-foreground hidden lg:block">{t("limit")}</p>

          <div>
            <Combobox
              options={PAGE_SIZE_OPTIONS}
              mode="single"
              value={pageSize}
              onValueChange={
                limit => onFiltersChange?.({
                  limit,
                })
              }
              className="w-auto min-h-8 hover:text-primary/10"
              align="start"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-3 lg:items-center">
          <p className={cn("text-sm text-muted-foreground")}>
            {t("page")}

            {" "}

            {activePage}

            {" "}

            {t("of")}

            {" "}

            {pageCount}
          </p>

          <div className="flex items-center gap-2 justify-end">
            <Button
              aria-label="Go to first page"
              onClick={first}
              disabled={!canPrevious}
              size="icon"
              variant="outline"
              className="hidden size-8 p-0 lg:flex"
            >
              <DoubleArrowLeftIcon aria-hidden="true" />
            </Button>

            <Button
              aria-label="Go to previous page"
              onClick={previous}
              disabled={!canPrevious}
              size="icon"
              variant="outline"
              className="size-8"
            >
              <ChevronLeftIcon aria-hidden="true" />
            </Button>

            <Button
              aria-label="Go to next page"
              onClick={next}
              disabled={!canNext}
              size="icon"
              variant="outline"
              className="size-8"
            >
              <ChevronRightIcon aria-hidden="true" />
            </Button>

            <Button
              aria-label="Go to last page"
              onClick={last}
              disabled={!canNext}
              size="icon"
              variant="outline"
              className={cn("hidden size-8 lg:flex")}
            >
              <DoubleArrowRightIcon aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
