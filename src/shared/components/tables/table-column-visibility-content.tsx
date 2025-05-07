/* eslint-disable custom-rules/encourage-object-params */
/* eslint-disable no-restricted-syntax */
"use client"

import React from "react"

import {
  type RowData, type Table, type VisibilityState,
} from "@tanstack/react-table"
import {
  useTranslations,
} from "next-intl"

import {
  SheetContent, SheetClose, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from "~/shared/components/dialogs/sheet-container"
import {
  Icon,
} from "~/shared/components/shared/icon"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Command, CommandGroup, CommandItem, CommandList,
} from "~/shared/components/ui/command"
import {
  cn,
} from "~/shared/utils"

interface TableColumnVisibleContentProps<T extends RowData> {
  table: Table<T>
}

export function TableColumnVisibleContent<T>({ table }: TableColumnVisibleContentProps<T>) {
  const t = useTranslations("common")
  const columns = React.useMemo(
    () => {
      return table.getAllLeafColumns().map(col => ({
        label: col.columnDef.meta?.columnName ?? col.id,
        value: col.id,
        disabled: !col.getCanHide(),
      }))
    }, []
  )

  const [
    columnVisibility,
    setColumnVisibility,
  ] = React.useState<VisibilityState>(() => {
    const visibility: VisibilityState = {
    }
    table.getAllLeafColumns().forEach((col) => {
      if (col.getCanHide()) {
        visibility[col.id] = col.getIsVisible()
      }
    })
    return visibility
  })

  const handleColumnVisibilityChange = React.useCallback(
    (
      value: boolean, name: string
    ) => {
      setColumnVisibility(prev => ({
        ...prev,
        [name]: value,
      }))
    }, []
  )

  const isAllColumnsVisibility = React.useMemo(
    () => Object.values(columnVisibility).every(Boolean), [columnVisibility]
  )

  const isSomeColumnsVisibility = React.useMemo(
    () => Object.values(columnVisibility).some(Boolean), [columnVisibility]
  )

  const handleToggleAllColumnsVisible = React.useCallback(
    () => {
      const newColumnVisibility: VisibilityState = {
      }

      Object.keys(columnVisibility).forEach((key) => {
        newColumnVisibility[key] = !isAllColumnsVisibility
      })

      setColumnVisibility(newColumnVisibility)
    }, [
      columnVisibility,
      isAllColumnsVisibility,
    ]
  )

  const handleChange = React.useCallback(
    () => {
      table.setColumnVisibility(columnVisibility)
    }, [columnVisibility]
  )

  return (
    <React.Fragment>
      <SheetHeader>
        <SheetTitle>{t("showColumns")}</SheetTitle>

        <SheetDescription />
      </SheetHeader>

      <SheetContent>
        <Command
          className="bg-transparent rounded-none h-auto"
        >
          <CommandList className="max-h-full">
            <CommandGroup className="p-0 *:flex *:gap-1 *:flex-col">
              <CommandItem
                onSelect={() => handleToggleAllColumnsVisible()}
                className="group data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 rounded-lg p-0 data-[selected=true]:bg-transparent"
              >
                <div className="flex-1 px-2 py-1.5 group-data-[state=checked]:border-primary border-2 border-transparent group-data-[state=checked]:text-primary group-data-[state=checked]:bg-accent rounded-xl flex gap-2 items-center bg-transparent group-data-[selected=true]:bg-accent">
                  <div
                    aria-label="Toggle all column"
                    className={
                      cn(
                        "size-4 shrink-0 grid place-content-center bg-zinc-700/50 group-data-[state=checked]:bg-primary rounded-lg text-white", isAllColumnsVisibility ? "bg-primary" : ""
                      )
                    }
                  >
                    <Icon.Check className={
                      cn(isSomeColumnsVisibility ? "opacity-100" : "opacity-0")
                    }
                    />
                  </div>

                  {t("all")}
                </div>
              </CommandItem>

              {
                columns.map(col => (
                  <CommandItem
                    key={col.value}
                    value={col.value}
                    onSelect={
                      name => handleColumnVisibilityChange(
                        !columnVisibility[col.value], name
                      )
                    }
                    disabled={col.disabled}
                    className="group data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 rounded-lg p-0 data-[selected=true]:bg-transparent"
                  >
                    <div
                      aria-label="visibility column"
                      className="flex-1 px-2 py-1.5 group-data-[state=checked]:border-primary border-2 border-transparent group-data-[state=checked]:text-primary group-data-[state=checked]:bg-accent rounded-xl flex gap-2 items-center bg-transparent group-data-[selected=true]:bg-accent"
                    >
                      <div className={
                        cn(
                          "size-4 shrink-0 grid place-content-center bg-zinc-700/50 group-data-[state=checked]:bg-primary rounded-lg text-white", columnVisibility[col.value] || col.disabled ? "bg-primary" : ""
                        )
                      }
                      >
                        <Icon.Check className={
                          cn(columnVisibility[col.value] || col.disabled ? "opacity-100" : "opacity-0")
                        }
                        />
                      </div>

                      {col?.label}
                    </div>
                  </CommandItem>
                ))
              }
            </CommandGroup>
          </CommandList>
        </Command>
      </SheetContent>

      <SheetFooter>
        <div className="grow flex *:flex-1 flex-col-reverse sm:flex-row gap-3">
          <SheetClose asChild>
            <Button
              type="button"
              variant="outline"
            >
              {t("cancel")}
            </Button>
          </SheetClose>

          <SheetClose
            onClick={() => handleChange()}
            asChild
          >
            <Button>{t("apply")}</Button>
          </SheetClose>
        </div>
      </SheetFooter>
    </React.Fragment>
  )
}
