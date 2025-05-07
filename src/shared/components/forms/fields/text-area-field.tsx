import {
  type ChangeEvent,
} from "react"

import {
  useFormContext,
} from "react-hook-form"

import {
  chain,
} from "~/shared/utils/chain"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/ui/form"
import {
  Textarea,
} from "~/shared/components/ui/textarea"

export function TextAreaField({
  name, label, onChange,
}: {
  name: string
  label?: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={
        ({ field }) =>
          (
            <FormItem>
              {
                label ? (
                  <FormLabel>{label}</FormLabel>
                ) : null
              }

              <FormControl>
                <Textarea
                  {...field}
                  onChange={
                    chain(
                      onChange, field.onChange
                    )
                  }
                  inputMode="text"
                  autoCapitalize="off"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )
      }
    />
  )
}
