/* eslint-disable no-restricted-syntax */
import {
  Fragment,
  useCallback,
} from "react"

import {
  ResetIcon,
} from "@radix-ui/react-icons"
import {
  CircleFadingPlus,
} from "lucide-react"

import {
  filterCommand,
} from "~/shared/utils/shared"

import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectList,
  SelectBox,
  SelectTrigger,
  SelectValue,
  SelectValueItem,
  SelectSeparator,
  type SelectProps,
  type ValueState,
  SelectInput,
  SelectEmpty,
  SelectIndicator,
} from "~/shared/components/ui/multi-select"
import {
  Separator,
} from "~/shared/components/ui/separator"
import {
  cn,
} from "~/shared/utils"

export type IFiltersSelectOption = {
  label: string
  value: string
}

export function BaseSelectFilter({
  options, title, hasSearch, classNames, ...props
}: SelectProps & {
  options: IFiltersSelectOption[]
  title: string
  hasSearch?: boolean
  classNames?: {
    content?: string
  }
}) {
  const isMulti = props.mode === "multiple"

  const checkValue = useCallback(
    (value: ValueState) => {
      if (!value) {
        return false
      }
      if (isMulti) {
        return value.length > 0
      }
      return true
    }, [isMulti]
  )

  return (
    <Select
      {...props}
    >
      <SelectTrigger
        className="w-auto h-8 text-xs"
      >
        <SelectValue>
          {
            ({ value }) => (
              <Fragment>
                <CircleFadingPlus />

                {title}

                {
                  checkValue(value) ? (
                    <Separator
                      orientation="vertical"
                      className="h-4"
                    />
                  ) : null
                }

                {
                  options.map(item => (
                    <SelectValueItem
                      key={item.value}
                      value={item.value}
                    >
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {item.label}
                      </Badge>

                    </SelectValueItem>
                  ))
                }
              </Fragment>
            )
          }
        </SelectValue>
      </SelectTrigger>

      <SelectContent className={
        cn(
          "min-w-40", classNames?.content
        )
      }
      >
        <SelectBox filter={hasSearch ? filterCommand : undefined}>
          {
            hasSearch
              ? (
                <Fragment>
                  <SelectInput placeholder="Tìm kiếm" />

                  <SelectEmpty>Không tìm thấy dữ liệu!</SelectEmpty>
                </Fragment>
              )
              : null
          }

          <SelectList>
            <SelectGroup>
              {
                options.map(item => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    keywords={[item.label]}
                  >
                    <SelectIndicator />

                    {item.label}
                  </SelectItem>
                ))
              }
            </SelectGroup>
          </SelectList>

          <SelectList>
            {
              ({ value }) => checkValue(value)
                ? (
                  <Fragment>
                    <SelectSeparator />

                    <SelectGroup>
                      <SelectItem
                        value=""
                        className="cursor-pointer hover:bg-accent"
                      >
                        <ResetIcon />
                        Đặt lại
                      </SelectItem>
                    </SelectGroup>
                  </Fragment>
                )
                : null
            }
          </SelectList>
        </SelectBox>
      </SelectContent>
    </Select>
  )
}
