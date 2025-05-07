/* eslint-disable no-restricted-syntax */
import React from "react"

import {
  Ellipsis,
} from "lucide-react"

import {
  type SelectProps, useReactSelect, type SelectValue,
  type ReturnSelect,
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
  Icon,
} from "~/shared/components/shared/icon"
import {
  Loading,
} from "~/shared/components/shared/loading"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "~/shared/components/ui/command"
import {
  cn,
} from "~/shared/utils"

// Chip Picker
export type BaseChipPickerProps<V extends SelectValue> = SelectProps<V> & {
  filter?: (value: string, search: string, keywords?: string[]) => number
  hasSearch?: boolean
  onSearchChange?: (search: string) => void
  orientation?: "horizontal" | "vertical"
  search?: string
  shouldFilter?: boolean
  classNames?: Partial<{
    group: string
    item: string
  }>
  enabled?: boolean
  defaultSearch?: string
}

export type ChipPickerProps<
  V extends SelectValue,
  O extends Record<string, unknown>,
> = BaseChipPickerProps<V> & {
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
  renderItem?: (values: O, ctx: ReturnSelect<V, SelectProps<V>>) => React.ReactNode
}

export function ChipPicker<
  V extends SelectValue,
  O extends Record<string, unknown>,
>({
  fieldNames = {
    label: "label",
    value: "value",
    disabled: "disabled",
  },
  error,
  fetchNextPage,
  filter,
  hasNextPage,
  hasSearch = false,
  isError,
  isFetchingNextPage,
  isLoading,
  onAllValueChange,
  onSearchChange,
  options = [],
  orientation = "horizontal",
  search,
  defaultSearch,
  shouldFilter = true,
  classNames,
  onValueChange,
  renderItem,
  ...props
}: ChipPickerProps<V, O>) {
  const reactSelect = useReactSelect<V>({
    ...props,
    onValueChange: chain(
      onValueChange as (value?: V | V[] | undefined) => void, (value) => {
        if (typeof onAllValueChange === "function") {
          const found = options?.filter((opt) => {
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
        label:
          typeof fieldNames.label === "function"
            ? fieldNames.label(option)
            : (option[fieldNames.label] ?? ""),
        value:
          typeof fieldNames.value === "function"
            ? fieldNames.value(option)
            : (option[fieldNames.value] ?? ""),
        disabled: typeof fieldNames.disabled === "function"
          ? fieldNames.disabled(option)
          : (fieldNames.disabled ? option[fieldNames.disabled] ?? false : false),
      } as {
        label: React.ReactNode
        value: V
        disabled: boolean
      }
    },
    [fieldNames],
  )

  return (
    <Command
      className="bg-transparent rounded-none h-auto"
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

      <CommandList className={
        cn(
          "max-h-max", hasSearch ? "mt-1" : ""
        )
      }
      >
        <CommandEmpty className="py-0">
          {
            isLoading ? (
              <Loading />
            ) : isError ? (
              <ErrorView error={error} />
            ) : (
              <ErrorView message="Không tìm thấy kết quả nào" />
            )
          }
        </CommandEmpty>

        <CommandGroup
          className={
            cn(
              "p-0 *:flex *:gap-1",
              orientation === "horizontal" ? "*:flex-wrap" : "*:flex-col",
              classNames?.group
            )
          }
        >
          {
            options.map((opt) => {
              const option = parseOption(opt)
              return (
                <CommandItem
                  key={option?.value}
                  {...reactSelect.getSelectItemProps({
                    value: option?.value,
                    onSelect: () => reactSelect.onSelect(option?.value),
                    disabled: option.disabled,
                  })}
                  className={
                    cn(
                      "group data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 rounded-lg p-0 data-[selected=true]:bg-transparent",
                      classNames?.item,
                    )
                  }
                  keywords={
                    typeof option?.label === "string"
                      ? [option?.label]
                      : undefined
                  }
                >
                  {
                    renderItem instanceof Function ? renderItem(
                      opt, reactSelect
                    ) : (
                      <div className={
                        cn(
                          "flex-1 px-2 py-1.5 group-data-[state=checked]:border-primary border-2 border-transparent group-data-[state=checked]:text-white group-data-[state=checked]:bg-accent rounded-xl bg-gray-200 flex gap-2 items-center",
                          orientation === "vertical" ? "bg-transparent group-data-[selected=true]:bg-accent" : ""
                        )
                      }
                      >
                        {
                          props.mode === "multiple" ? (
                            <div className="size-4 shrink-0 grid place-content-center bg-zinc-700/50 group-data-[state=checked]:bg-primary rounded-lg text-white">
                              <Icon.Check className="group-data-[state=unchecked]:opacity-0" />
                            </div>
                          ) : orientation === "vertical" ? (
                            <div className="size-4 border-2 border-foreground/10 rounded-full group-data-[state=checked]:border-4 group-data-[state=checked]:border-primary" />
                          ) : null
                        }

                        {option?.label}
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
  )
}
