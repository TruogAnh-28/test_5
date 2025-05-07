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
  TextInput,
} from "~/shared/components/inputs/text-input"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/ui/form"

export function TextField({
  name, label, onChange, description,
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
                <TextInput
                  {...field}
                  onChange={
                    chain(
                      field.onChange, onChange,
                    )
                  }
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
