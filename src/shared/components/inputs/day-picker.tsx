import React from "react"

import {
  vi,
} from "date-fns/locale"

import {
  Calendar, type CalendarProps,
} from "~/shared/components/ui/calendar"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "~/shared/components/ui/popover"

type DayPickerProps = CalendarProps & {
  className?: string
  classNames?: Record<string, string>
  hasOutsideDays?: boolean
  mode?: "single" | "range"
  TriggerComponent?: React.ReactElement
  onDayClick?: React.MouseEventHandler<HTMLSpanElement>
}

export function DayPicker({
  TriggerComponent, align = "start", ...props
}: DayPickerProps & { align?: "center" | "end" | "start" }) {
  const [
    open,
    setOpen,
  ] = React.useState(false)

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      {TriggerComponent ? <PopoverTrigger asChild>{TriggerComponent}</PopoverTrigger> : null}

      <PopoverContent
        className="w-auto bg-white p-0"
        align={align}
      >
        <Calendar
          locale={vi}
          onDayClick={() => setOpen(props.mode === "range")}
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}
