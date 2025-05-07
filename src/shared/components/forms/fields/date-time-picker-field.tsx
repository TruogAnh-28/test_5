import {
  useState,
} from "react"

import {
  format,
  getYear,
} from "date-fns"
import {
  vi,
} from "date-fns/locale"
import {
  CalendarIcon,
} from "lucide-react"
import {
  useFormContext,
} from "react-hook-form"

import {
  TimePicker,
} from "~/shared/components/inputs/time-picker"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Calendar,
  type CalendarProps,
} from "~/shared/components/ui/calendar"
import {
  FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/shared/components/ui/popover"
import {
  cn,
} from "~/shared/utils"

export function DateTimePickerField({
  name = "date", label = "Date", description, placeholder, onValueChange, disabled, fromYear, toYear,
}: {
  name: string
  label?: string
  description?: string
  placeholder?: string
  onValueChange?: (value?: Date) => void
  disabled?: CalendarProps["disabled"]
  fromYear?: CalendarProps["fromYear"]
  toYear?: CalendarProps["toYear"]
}) {
  const [
    open,
    setOpen,
  ] = useState(false)
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={
        ({ field }) => (
          <FormItem>
            {
              label ? (
                <FormLabel>{label}</FormLabel>
              ) : null
            }

            <Popover
              open={open}
              onOpenChange={setOpen}
            >
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={
                      cn(
                        "w-full pl-3 text-left font-normal capitalize",
                        !field.value && "text-muted-foreground"
                      )
                    }
                  >
                    {
                      field.value ? (
                        format(
                          field.value, "dd/MM/yyyy, HH:mm", {
                            locale: vi,
                          }
                        )
                      ) : placeholder ? (
                        <span>{placeholder}</span>
                      ) : null
                    }

                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto p-0"
                align="start"
              >
                <Calendar
                  fromYear={fromYear ?? 1960}
                  toYear={toYear ?? getYear(new Date())}
                  disabled={
                    disabled
                    ?? (date => date < new Date("1960-01-01"))
                  }
                  locale={vi}
                  initialFocus
                  selected={new Date(field.value)}
                  mode="single"
                  captionLayout="dropdown-buttons"
                  onSelect={
                    (day) => {
                      field.onChange(day?.toISOString())
                      onValueChange?.(day)
                    }
                  }
                />

                <div className="px-3">
                  <TimePicker
                    hasLabel
                    value={new Date(field.value)}
                    onValueChange={
                      (time) => {
                        field.onChange(time?.toISOString())
                        onValueChange?.(time)
                      }
                    }
                  />
                </div>

                <div className="p-3 flex justify-between">
                  <Button
                    onClick={() => field.onChange(new Date().toISOString())}
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

            {
              description ? (
                <FormDescription>{description}</FormDescription>
              ) : null
            }

            <FormMessage />
          </FormItem>
        )
      }
    />
  )
}
