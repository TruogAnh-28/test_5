/* eslint-disable custom-rules/encourage-object-params */
import React from "react"

import {
  useTranslations,
} from "next-intl"
import {
  type ControllerFieldState,
  type ControllerRenderProps,
  type SubmitHandler,
  useForm,
  type UseFormStateReturn,
  type FieldValues,
} from "react-hook-form"

import {
  PARAM_RESET,
} from "~/shared/hooks/state/use-url-params"

import {
  cloneObject,
} from "~/shared/utils/shared"

import {
  backDialog,
} from "~/shared/components/dialogs/use-open-dialog"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/shared/components/ui/form"
import {
  Separator,
} from "~/shared/components/ui/separator"
import {
  SheetClose,
  SheetDescription, SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/shared/components/ui/sheet"
import {
  cn,
} from "~/shared/utils"

type Filters = Record<string, unknown>

export type FilterField = {
  name: string
  title?: string
  children: React.ReactNode | ((props: {
    field: ControllerRenderProps<FieldValues, string>
    fieldState: ControllerFieldState
    formState: UseFormStateReturn<FieldValues>
  }) => React.ReactNode)
}

export interface FiltersContentProps {
  defaultFilters?: Filters
  filters?: Filters
  onFiltersChange?: (filters: Filters) => void
  fields?: FilterField[]
  onConfirmClick?: () => void
  hasBack?: boolean
}

export function FiltersContent({
  defaultFilters, filters, onFiltersChange, fields = [], onConfirmClick = backDialog, hasBack,
}: FiltersContentProps) {
  const form = useForm<Filters>({
    defaultValues: defaultFilters,
    values: filters ? {
      ...filters,
      page: defaultFilters?.page ?? 1,
    } : undefined,
    resetOptions: {
      keepDefaultValues: true,
    },
  })
  const t = useTranslations("common")
  const handleSubmit: SubmitHandler<Filters> = React.useCallback(
    (values) => {
      const params = cloneObject(
        values, (
          val, key
        ) => {
          if (defaultFilters && val === form.formState.defaultValues?.[key]) {
            return PARAM_RESET
          }
          return val
        }
      )

      onFiltersChange?.(params as Filters)
      // submit cũng như click nhưng cần xử lý trước khi click
      onConfirmClick()
    }, [
      defaultFilters,
      form.formState.defaultValues,
    ]
  )

  return (
    <Form {...form}>
      <SheetHeader className="pt-4 px-4">
        <SheetTitle>{t("searchFilter")}</SheetTitle>

        <SheetDescription />
      </SheetHeader>

      <div className="grow w-96 p-4 overflow-y-auto space-y-4">
        {
          fields.map((
            field, index
          ) => (
            <React.Fragment key={field.name}>
              <FormField
                control={form.control}
                name={field.name}
                render={
                  props => (
                    <FormItem className="space-y-3">
                      {
                        field.title ? (
                          <FormLabel>{field.title}</FormLabel>
                        ) : null
                      }

                      <FormControl>
                        {field.children instanceof Function ? field.children(props) : field.children}
                      </FormControl>
                    </FormItem>
                  )
                }
              />

              {
                index < fields.length - 1 ? (
                  <Separator />
                ) : null
              }
            </React.Fragment>
          ))
        }
      </div>

      <SheetFooter className="p-4 border-t">
        <div className="grow flex *:flex-1 flex-col-reverse sm:flex-row gap-3">
          {
            hasBack ? (
              <SheetClose asChild>
                <Button
                  onClick={backDialog}
                  type="button"
                  variant="outline"
                >
                  {t("back")}
                </Button>
              </SheetClose>
            ) : null
          }

          <Button
            onClick={() => form.reset()}
            type="button"
            variant="outline"
            className={cn(defaultFilters === undefined ? "hidden" : "")}
          >
            {t("reset")}
          </Button>

          <SheetClose asChild>
            <Button
              onClick={
                () => form.handleSubmit(handleSubmit)()
              }
            >
              {t("apply")}
            </Button>
          </SheetClose>
        </div>
      </SheetFooter>
    </Form>
  )
}
