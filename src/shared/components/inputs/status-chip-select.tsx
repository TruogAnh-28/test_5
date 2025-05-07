import {
  type BaseChipPickerProps,
  ChipPicker,
} from "~/shared/components/inputs/chip-picker"

const StatusOptions = [
  {
    label: "Tắt",
    value: 0,
  },
  {
    label: "Bật",
    value: 1,
  },
]

export function StatusChipSelect(props: BaseChipPickerProps<number>) {
  return (
    <ChipPicker
      options={StatusOptions}
      {...props}
    />
  )
}
