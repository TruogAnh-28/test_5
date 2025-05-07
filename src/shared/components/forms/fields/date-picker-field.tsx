import {
  useCallback,
  useState,
} from "react"

import {
  format, getYear,
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
  Button,
} from "~/shared/components/ui/button"
import {
  Calendar, type CalendarProps,
} from "~/shared/components/ui/calendar"
import {
  FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "~/shared/components/ui/popover"
import {
  cn,
} from "~/shared/utils"

export function DatePickerField({
  name, label, description, placeholder, disabled, fromYear, toYear, format: formatProp, parse: parseProp, formatView: formatViewProp,
}: {
  name: string
  label?: string
  description?: string
  placeholder?: string
  disabled?: CalendarProps["disabled"]
  fromYear?: CalendarProps["fromYear"]
  toYear?: CalendarProps["toYear"]
  format?: (value: Date) => string
  parse?: (value: string) => Date | undefined
  formatView?: (value: string) => string
}) {
  const [
    open,
    setOpen,
  ] = useState(false)
  const { control } = useFormContext()

  const formatView = useCallback(
    (value: string) => {
      if (formatViewProp instanceof Function) {
        return formatViewProp(value)
      }

      return format(
        value, "dd/MM/yyyy"
      )
    }, [formatViewProp]
  )

  return (
    <FormField
      control={control}
      name={name}
      render={
        ({ field }) => (
          <FormItem>
            {label ? <FormLabel>{label}</FormLabel> : null}

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
                        "w-full pl-3 text-left font-normal capitalize", !field.value && "text-muted-foreground"
                      )
                    }
                  >
                    {
                      field.value
                        ? formatView(field.value)
                        : placeholder
                          ? <span>{placeholder}</span>
                          : null
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
                  disabled={disabled ?? (date => date < new Date("1960-01-01"))}
                  locale={vi}
                  initialFocus
                  selected={parseProp instanceof Function ? parseProp(field.value) : new Date(field.value)}
                  mode="single"
                  captionLayout="dropdown-buttons"
                  onSelect={
                    (day) => {
                      const value = formatProp instanceof Function && day
                        ? formatProp(day)
                        : day?.toISOString() || ""
                      field.onChange(value)
                      setOpen(false)
                    }
                  }
                />
              </PopoverContent>
            </Popover>

            {description ? <FormDescription>{description}</FormDescription> : null}

            <FormMessage />
          </FormItem>
        )
      }
    />
  )
}
