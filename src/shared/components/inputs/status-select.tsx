import {
  type BaseChipPickerProps,
} from "~/shared/components/inputs/chip-picker"
import {
  StatusChipSelect,
} from "~/shared/components/inputs/status-chip-select"

export function StatusSelect(props: BaseChipPickerProps<number>) {
  return (
    <div className="flex">
      <div className="border p-1 rounded-2xl ">
        <StatusChipSelect
          classNames={
            {
              item: "font-medium *:bg-transparent data-[selected=true]:text-accent ",
            }
          }
          {...props}
        />
      </div>
    </div>
  )
}
