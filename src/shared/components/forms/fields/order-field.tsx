import {
  useFormContext,
} from "react-hook-form"

import {
  CounterInput,
} from "~/shared/components/inputs/counter-input"
import {
  FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"

export function OrderField() {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name="order"
      render={
        ({ field }) =>
          (
            <FormItem>
              <FormLabel>Thứ tự</FormLabel>

              <CounterInput
                min={0}
                value={field.value}
                onValueChange={
                  (floatValue) => {
                    field.onChange(floatValue)
                  }
                }
              />

              <FormMessage />
            </FormItem>
          )
      }
    />
  )
}
