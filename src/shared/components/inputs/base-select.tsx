/* eslint-disable no-restricted-syntax */

import {
  Fragment,
} from "react"

import {
  X,
} from "lucide-react"

import {
  filterCommand,
} from "~/shared/utils/shared"

import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Select,
  SelectBox,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectIcon,
  SelectIndicator,
  SelectInput,
  SelectItem,
  SelectList,
  SelectTrigger,
  SelectValue,
  SelectValueItem,
  SelectValueRemove,
  type SelectProps,
} from "~/shared/components/ui/multi-select"

export type ISelectOption = {
  label: string
  value: string
}

type BaseSelectProps = SelectProps & {
  options: ISelectOption[]
  placeholder?: string
  hasSearch?: boolean
  viewCount?: number
}

export function BaseSelect({
  options, placeholder, hasSearch, viewCount = 2, ...props
}: BaseSelectProps) {
  return (
    <Select
      {...props}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder}>
          {
            ({ value }) =>
              props.mode === "single"
                ? options.map(option => (
                  <SelectValueItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectValueItem>
                ))
                : value && value.length > viewCount
                  ? <Badge variant="outline">{value.length}</Badge>
                  : options.map(option => (
                    <SelectValueItem
                      key={option.value}
                      value={option.value}
                      asChild
                    >
                      <Badge
                        variant="outline"
                        className="py-0 h-6 rounded-full gap-1 pr-0.5 -ml-1.5"
                      >
                        {option.label}

                        <SelectValueRemove className="size-5 hover:bg-destructive/10 rounded-full hover:text-destructive">
                          <X />
                        </SelectValueRemove>
                      </Badge>
                    </SelectValueItem>
                  ))
          }
        </SelectValue>

        <SelectIcon />
      </SelectTrigger>

      <SelectContent>
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
                options.map(option => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label]}
                  >
                    <SelectIndicator />

                    {option.label}
                  </SelectItem>
                ))
              }
            </SelectGroup>
          </SelectList>
        </SelectBox>
      </SelectContent>
    </Select>
  )
}
