import {
  useState,
} from "react"

import {
  vi,
} from "date-fns/locale"
import {
  type DayPickerSingleProps,
} from "react-day-picker"

import {
  TimePicker,
} from "~/shared/components/inputs/time-picker"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Calendar,
} from "~/shared/components/ui/calendar"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "~/shared/components/ui/popover"

type DayPickerFieldProps = Omit<DayPickerSingleProps, "mode"> & {
  className?: string
  classNames?: Record<string, string>
  hasOutsideDays?: boolean

  TriggerComponent?: React.ReactElement
  onDayClick?: React.MouseEventHandler<HTMLSpanElement>
  onSelect?: (date?: Date) => void
}

export function DateTimePickerSingle({
  TriggerComponent, ...props
}: DayPickerFieldProps) {
  const [
    open,
    setOpen,
  ] = useState(false)
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      {TriggerComponent ? <PopoverTrigger asChild>{TriggerComponent}</PopoverTrigger> : null}

      <PopoverContent
        className="w-auto p-0"
        align="start"
      >
        <Calendar
          locale={vi}
          mode="single"
          {...props}
        />

        <div className="px-3">
          <TimePicker
            hasLabel
            value={props.selected}
            onValueChange={
              (time) => {
                props.onSelect?.(time)
              }
            }
          />
        </div>

        <div className="p-3 flex justify-between">
          <Button
            onClick={
              () => {
                props.onSelect?.(new Date())
                setOpen(false)
              }
            }
            type="button"
            size="sm"
            variant="outline"
          >
            Bây giờ
          </Button>

          <Button
            onClick={() => setOpen(false)}
            type="button"
            size="sm"
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
