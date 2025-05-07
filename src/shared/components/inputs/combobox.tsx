/* eslint-disable no-restricted-syntax */
import React from "react"

import {
  Check,
  ChevronDown,
  Ellipsis,
  X,
} from "lucide-react"

import {
  type SelectProps, useReactSelect, type SelectValue,
} from "~/shared/hooks/ui/use-react-select"

import {
  chain,
} from "~/shared/utils/chain"
import {
  filterCommand,
} from "~/shared/utils/shared"

import {
  ErrorView,
} from "~/shared/components/shared/error"
import {
  Loading,
} from "~/shared/components/shared/loading"
import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "~/shared/components/ui/command"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "~/shared/components/ui/popover"
import {
  cn,
} from "~/shared/utils"

// Combobox
export type BaseComboboxProps<V extends SelectValue> = SelectProps<V> & {
  align?: "center" | "end" | "start"
  className?: string
  enabled?: boolean
  filter?: (value: string, search: string, keywords?: string[]) => number
  hasSearch?: boolean
  maxCount?: number
  onSearchChange?: (search: string) => void
  placeholder?: string
  search?: string
  defaultSearch?: string
  shouldFilter?: boolean
  TriggerComponent?: React.ReactElement
  classNames?: Partial<{
    group: string
    item: string
  }>
}

export type ComboboxProps<V extends SelectValue, O extends Record<string, unknown>> = BaseComboboxProps<V> & {
  error?: Error | null
  fetchNextPage?: () => void
  fieldNames?: {
    label: keyof O | ((value: O) => unknown)
    value: keyof O | ((value: O) => unknown)
    disabled?: keyof O | ((value: O) => unknown)
  }
  hasNextPage?: boolean
  isError?: boolean
  isFetchingNextPage?: boolean
  isLoading?: boolean
  onAllValueChange?: (values: O[]) => void
  options?: O[]
  renderItem?: (values: O) => React.ReactNode
  EmptyResultComponent?: React.ReactNode
}

export function Combobox<V extends SelectValue, O extends Record<string, unknown>>({
  fieldNames = {
    label: "label",
    value: "value",
    disabled: "disabled",
  },
  align,
  className,
  enabled = true,
  error,
  fetchNextPage,
  filter,
  hasNextPage,
  hasSearch = false,
  isError,
  isFetchingNextPage,
  isLoading,
  maxCount = 2,
  onAllValueChange,
  onSearchChange,
  options = [],
  placeholder,
  defaultSearch,
  search,
  shouldFilter = true,
  TriggerComponent,
  onValueChange,
  renderItem,
  EmptyResultComponent,
  classNames,
  ...props
}: ComboboxProps<V, O>) {
  const [
    open,
    setOpen,
  ] = React.useState(false)

  const {
    getSelectItemProps, onSelect, isSelected, selected,
  } = useReactSelect<V>({
    ...props,
    onValueChange: chain(
      onValueChange as (value?: V | V[] | undefined) => void, (value) => {
        if (typeof onAllValueChange === "function") {
          const found
          = options?.filter((opt) => {
            const option = parseOption(opt)

            if (props.mode === "multiple") {
              return (value as V[]).includes(option.value)
            }
            return value === option.value
          }) ?? []

          onAllValueChange(found)
        }
      }
    ),
  })

  const parseOption = React.useCallback(
    function (option: O) {
      return {
        label: typeof fieldNames.label === "function" ? fieldNames.label(option) : option[fieldNames.label] ?? "",
        value: typeof fieldNames.value === "function" ? fieldNames.value(option) : option[fieldNames.value] ?? "",
        disabled: typeof fieldNames.disabled === "function"
          ? fieldNames.disabled(option)
          : (fieldNames.disabled ? option[fieldNames.disabled] ?? false : false),
      } as {
        label: React.ReactNode
        value: V
        disabled: boolean
      }
    },
    [fieldNames]
  )

  const selectedSingleMode = React.useCallback(
    (
      option?: O, defaultValue?: string
    ) => {
      if (option) {
        return parseOption(option).label ?? defaultValue
      }
      return defaultValue
    },
    [parseOption]
  )

  return (
    <Popover
      onOpenChange={setOpen}
      open={open}
    >
      <PopoverTrigger
        asChild
        disabled={!enabled}
      >
        {
          TriggerComponent ?? (
            <Button
              className={
                cn(
                  "flex h-auto min-h-9 w-full justify-between px-3 py-1 hover:bg-transparent rounded-2xl text-start", className,
                )
              }
              aria-expanded={open}
              role="combobox"
              variant="outline"
            >
              {
                props.mode === "single" ? (
                  <div className="text-start">
                    {
                      selectedSingleMode(
                        options?.find((it) => {
                          const item = parseOption(it)
                          return isSelected(item?.value)
                        }),
                        placeholder
                      )
                    }
                  </div>
                ) : props.mode === "multiple" ? (
                  !selected || (Array.isArray(selected) && selected.length === 0) ? (
                    <div>{placeholder}</div>
                  ) : Array.isArray(selected) && selected.length > maxCount ? (
                    <div className="-mx-2">
                      <Badge
                        className="max-w-36 gap-1 rounded-full"
                        variant="outline"
                      >
                        {selected?.length}

                        {" đã chọn"}
                      </Badge>
                    </div>
                  ) : (
                    <div className="-mx-2 flex flex-wrap gap-1">
                      {
                        options.map((opt) => {
                          const option = parseOption(opt)
                          if (isSelected(option?.value)) {
                            return (
                              <Badge
                                className="max-w-36 gap-1 rounded-full pr-0.5"
                                key={option?.value}
                                variant="outline"
                              >
                                <div className="truncate">{option?.label}</div>

                                <div
                                  className="rounded-full border border-transparent p-px hover:border-border"
                                  onClick={
                                    (e) => {
                                      e.stopPropagation()
                                      onSelect(option?.value)
                                    }
                                  }
                                  role="button"
                                >
                                  <X />
                                </div>
                              </Badge>
                            )
                          }
                        })
                      }
                    </div>
                  )
                ) : null
              }

              <div className="size-4 shrink-0 grid place-content-center opacity-50">
                <ChevronDown />
              </div>
            </Button>
          )
        }
      </PopoverTrigger>

      <PopoverContent
        align={align}
        className="w-[--radix-popover-trigger-width] min-w-52 p-0 bg-white"
      >
        <Command
          className="bg-transparent"
          filter={filter ?? filterCommand}
          shouldFilter={shouldFilter}
        >
          {
            hasSearch ? (
              <CommandInput
                defaultValue={defaultSearch}
                onValueChange={onSearchChange}
                placeholder="Tìm kiếm"
                value={search}
              />
            ) : null
          }

          <CommandList>
            <CommandEmpty className="py-0">
              {
                isLoading
                  ? <Loading />
                  : isError
                    ? EmptyResultComponent ?? <ErrorView error={error} />
                    : EmptyResultComponent ?? <ErrorView message="Không tìm thấy kết quả nào" />
              }
            </CommandEmpty>

            <CommandGroup className={cn(classNames?.group)}>
              {
                options.map((opt) => {
                  const option = parseOption(opt)
                  return (
                    <CommandItem
                      key={option?.value}
                      {...getSelectItemProps({
                        value: option?.value,
                        onSelect: () => {
                          onSelect(option?.value)
                          // Chế độ chọn nhiều -> Không đóng popover
                          setOpen(props.mode === "multiple")
                        },
                        disabled: option.disabled,
                      })}
                      keywords={typeof option?.label === "string" ? [option?.label] : undefined}
                      className={
                        cn(
                          "group data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 rounded-lg p-0 data-[selected=true]:bg-transparent", classNames?.item
                        )
                      }
                    >
                      {
                        renderItem instanceof Function ? renderItem(opt) : (
                          <div className="flex-1 px-2 py-1.5 flex gap-1.5 items-center group-data-[selected=true]:bg-muted/50 group-data-[state=checked]:bg-accent rounded-lg">
                            <div className="flex-1">
                              {option?.label}
                            </div>

                            <div className="group-data-[state=unchecked]:opacity-0 size-4 shrink-0 grid place-content-center">
                              <Check />
                            </div>
                          </div>
                        )
                      }
                    </CommandItem>
                  )
                })
              }
            </CommandGroup>

            {
              hasNextPage ? (
                <CommandGroup className="text-center border-t">
                  <Button
                    className="w-full"
                    isLoading={isFetchingNextPage}
                    onClick={fetchNextPage}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    <Ellipsis />

                    Tải thêm
                  </Button>
                </CommandGroup>
              ) : null
            }
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
