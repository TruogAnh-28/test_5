import {
  useFormContext,
} from "react-hook-form"

import {
  StatusSelect,
} from "~/shared/components/inputs/status-select"
import {
  FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"

export function StatusField() {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name="status"
      render={
        ({ field }) =>
          (
            <FormItem>
              <FormLabel>Hiển thị</FormLabel>

              <StatusSelect
                mode="single"
                value={field.value}
                onValueChange={value => field.onChange(value)}
              />

              <FormMessage />
            </FormItem>
          )
      }
    />
  )
}
