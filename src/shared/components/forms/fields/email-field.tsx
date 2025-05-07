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
  FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"
import {
  Input,
} from "~/shared/components/ui/input"

export function EmailField({
  name = "email", label = "Email", onChange, description,
}: {
  name: string
  label?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  description?: string
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
                <Input
                  {...field}
                  onChange={
                    chain(
                      field.onChange, onChange,
                    )
                  }
                  type="text"
                  inputMode="email"
                  autoCapitalize="off"
                />
              </FormControl>

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
