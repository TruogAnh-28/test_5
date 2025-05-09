import React, {
  useEffect,
} from "react"

import {
  Calendar,
  HelpCircle,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"
import {
  type UseFormReturn,
} from "react-hook-form"

import {
  type SubmitlinkCampaignsInput,
} from "~/features/submitlink-campaigns/type/submitlink-campaigns"
import {
  DayPicker,
} from "~/shared/components/inputs/day-picker"
import {
  TextInput,
} from "~/shared/components/inputs/text-input"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "~/shared/components/ui/card"
import {
  FormControl,
  FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/shared/components/ui/tooltip"

interface CampaignBasicInfoProps {
  form: UseFormReturn<SubmitlinkCampaignsInput>
  tooltips: {
    name: string
    startDate: string
    endDate: string
  }
}

export function CampaignBasicInfo({
  form, tooltips,
}: CampaignBasicInfoProps) {
  const t = useTranslations("submitlinkCampaigns")

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  today.setHours(
    0, 0, 0, 0
  )

  // Effect to validate and handle date changes
  useEffect(
    () => {
      const subscription = form.watch((
        value, { name }
      ) => {
      // Only run when either date changes
        if (name !== "startDate" && name !== "endDate") {
          return
        }

        const startDate = value.startDate ? new Date(value.startDate) : null
        const endDate = value.endDate ? new Date(value.endDate) : null

        if (!startDate || !endDate) {
          return
        }

        // If endDate is before startDate, reset endDate and show error
        if (endDate < startDate) {
          form.setValue(
            "endDate", ""
          )
          form.setError(
            "endDate", {
              type: "manual",
              message: t("form.errors.endDateBeforeStartDate") || "End date must be after start date",
            }
          )
        }
        else {
          form.clearErrors("endDate")
        }
      })

      return () => subscription.unsubscribe()
    }, [
      form,
      t,
    ]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("form.campaignInfo")}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid lg:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={
              ({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel required>
                    {t("form.name")}

                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipTrigger>

                        <TooltipContent>{tooltips.name}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>

                  <FormControl>
                    <TextInput
                      {...field}
                      placeholder={t("form.placeholders.name")}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
            }
          />

          {/* Empty div for grid layout */}

          <FormField
            control={form.control}
            name="startDate"
            render={
              ({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel required>
                    {t("form.startDate")}

                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipTrigger>

                        <TooltipContent>{tooltips.startDate}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>

                  <DayPicker
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={date => field.onChange(date?.toISOString())}
                    disabled={
                      {
                        before: tomorrow,
                      }
                    }
                    fromDate={tomorrow}
                    TriggerComponent={
                      (
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 size-4" />

                          {field.value ? new Date(field.value).toLocaleDateString("vi-VN") : t("filters.chooseStartDate")}
                        </Button>
                      )
                    }
                  />

                  <FormMessage />
                </FormItem>
              )
            }
          />

          <FormField
            control={form.control}
            name="endDate"
            render={
              ({ field }) => {
                const startDate = form.watch("startDate") ? new Date(form.watch("startDate") ?? "") : null

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel required>
                      {t("form.endDate")}

                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                          </TooltipTrigger>

                          <TooltipContent>{tooltips.endDate}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>

                    <DayPicker
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={date => field.onChange(date?.toISOString())}
                      disabled={
                        {
                          before: startDate || tomorrow, // Disable dates before start date or today
                        }
                      }
                      fromDate={startDate || tomorrow} // Set minimum selectable date to start date or today
                      TriggerComponent={
                        (
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <Calendar className="mr-2 size-4" />

                            {field.value ? new Date(field.value).toLocaleDateString("vi-VN") : t("filters.chooseEndDate")}
                          </Button>
                        )
                      }
                    />

                    <FormMessage />
                  </FormItem>
                )
              }
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
