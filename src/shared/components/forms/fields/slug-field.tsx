import {
  RotateCcw,
} from "lucide-react"
import {
  useFormContext,
} from "react-hook-form"
import {
  toast,
} from "sonner"

import {
  slugify,
} from "~/shared/utils/slugify"

import {
  Button,
} from "~/shared/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/ui/form"
import {
  Input,
} from "~/shared/components/ui/input"

export function SlugField({
  targetName, name = "slug", label = "slug", fn, space,
}: {
  targetName: string
  name?: string
  label?: string
  fn?: (value: string) => string
  space?: string
}) {
  const {
    control, getValues, setValue,
  } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={
        ({ field }) =>
          (
            <FormItem>
              <FormLabel>{label}</FormLabel>

              <div className="flex gap-3">
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                  />
                </FormControl>

                <Button
                  type="button"
                  onClick={
                    () => {
                      const value = getValues(targetName)

                      if (!value) {
                        toast.info(`Vui lòng nhập ${targetName} trước`)
                        return
                      }

                      let newSlug = slugify(
                        value, space
                      )

                      if (fn instanceof Function) {
                        newSlug = fn(newSlug)
                      }

                      setValue(
                        name, newSlug, {
                          shouldValidate: true,
                          shouldTouch: true,
                          shouldDirty: true,
                        }
                      )
                    }
                  }
                  variant="secondary"
                >
                  <RotateCcw />
                  Tạo
                </Button>
              </div>

              <FormMessage />
            </FormItem>
          )
      }
    />
  )
}
