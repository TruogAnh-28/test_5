import {
  getYear,
  format,
} from "date-fns"
import {
  CalendarIcon,
} from "lucide-react"

import {
  DayPicker,
} from "~/shared/components/inputs/day-picker"
import {
  Button,
} from "~/shared/components/ui/button"

export interface TimeSelectProps {
  value: string
  onChange: (value: string) => void
}

export function TimeSelect({
  value, onChange,
}: TimeSelectProps) {
  return (
    <DayPicker
      TriggerComponent={
        (
          <Button
            variant="outline"
            className="w-full pl-3 text-left font-normal capitalize"
          >
            {
              value ? format(
                new Date(value), "dd/MM/yyyy"
              ) : null
            }

            <CalendarIcon className="ml-auto size-4 opacity-50" />
          </Button>
        )
      }
      fromYear={1960}
      toYear={getYear(new Date())}
      disabled={date => date < new Date("1960-01-01")}
      captionLayout="dropdown-buttons"
      mode="single"
      defaultMonth={value ? new Date(value) : undefined}
      selected={value ? new Date(value) : undefined}
      required
      onSelect={
        (day) => {
          if (day) {
            const value = format(
              day, "yyyy-MM-dd"
            )
            onChange(value)
          }
        }
      }
    />
  )
}
