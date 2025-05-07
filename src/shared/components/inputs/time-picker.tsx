import {
  useRef,
} from "react"

import {
  Label,
} from "~/shared/components/ui/label"
import {
  TimePickerInput,
} from "~/shared/components/ui/time-picker-input"
import {
  cn,
} from "~/shared/utils"

interface TimePickerProps {
  className?: string
  disabled?: boolean
  hasLabel?: boolean
  onValueChange?: (date?: Date) => void
  value?: Date
}

export function TimePicker({
  value: date, onValueChange: onValueChange, hasLabel, className, disabled,
}: TimePickerProps) {
  const minuteRef = useRef<HTMLInputElement>(null)
  const hourRef = useRef<HTMLInputElement>(null)

  return (
    <div className={
      cn(
        "flex items-end gap-2", className
      )
    }
    >
      <div className="grid gap-1 text-center">
        {
          hasLabel ? (
            <Label
              htmlFor="hours"
              className="text-xs"
            >
              Giờ
            </Label>
          ) : null
        }

        <TimePickerInput
          disabled={disabled}
          picker="hours"
          date={date}
          setDate={onValueChange}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
          className="rounded-xl"
        />
      </div>

      <div className="grid gap-1 text-center">
        {
          hasLabel ? (
            <Label
              htmlFor="minutes"
              className="text-xs"
            >
              Phút
            </Label>
          ) : null
        }

        <TimePickerInput
          disabled={disabled}
          picker="minutes"
          date={date}
          setDate={onValueChange}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          className="rounded-xl"
        />
      </div>
    </div>
  )
}
