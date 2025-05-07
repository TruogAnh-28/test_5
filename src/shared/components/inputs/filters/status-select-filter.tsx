import {
  type SelectSingleProps, useReactSelect,
} from "~/shared/hooks/ui/use-react-select"

import {
  Command, CommandGroup, CommandItem, CommandList,
} from "~/shared/components/ui/command"

const StatusOptions = [
  {
    label: "Bật",
    value: "1",
  },
  {
    label: "Tắt",
    value: "0",
  },
]

export function StatusSelectFilter(props: SelectSingleProps<string>) {
  const {
    getSelectItemProps, onSelect,
  } = useReactSelect<string>({
    mode: "single",
    ...props,
  })

  return (
    <Command
      shouldFilter={false}
      className="bg-transparent"
    >
      <CommandList>
        <CommandGroup className="*:flex *:gap-3">
          {
            StatusOptions.map(status => (
              <CommandItem
                key={status.value}
                {...getSelectItemProps({
                  value: status.value,
                  onSelect: value => onSelect(value),
                })}
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 bg-accent"
              >
                {status.label}
              </CommandItem>
            ))
          }
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
