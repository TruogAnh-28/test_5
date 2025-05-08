import React, {
  useEffect,
} from "react"

import Image from "next/image"

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
  type TrafficSeoCampaignsInput,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "~/shared/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/shared/components/ui/tooltip"

interface Country {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

interface CampaignBasicInfoProps {
  form: UseFormReturn<TrafficSeoCampaignsInput>
  countries: Country[]
  tooltips: {
    name: string
    domain: string
    search: string
    title: string
    startDate: string
    endDate: string
    device: string
    status: string
    country: string
  }
}

export function CampaignBasicInfo({
  form, countries, tooltips,
}: CampaignBasicInfoProps) {
  const t = useTranslations("trafficSeoCampaigns")

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
        // Clear any existing endDate errors if dates are now valid
          form.clearErrors("endDate")
        }
      })

      return () => subscription.unsubscribe()
    }, [
      form,
      t,
    ]
  )

  const DeviceOptions = [
    {
      label: t("deviceOptions.desktop"),
      value: "desktop",
    },
    {
      label: t("deviceOptions.mobile"),
      value: "mobile",
    },
    {
      label: t("deviceOptions.tablet"),
      value: "tablet",
    },
    {
      label: t("filters.allDevices"),
      value: "all",
    },
  ]

  const countryOptions = countries.map(country => ({
    label: country.name,
    value: country.id.toString(),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("form.sectionInfo")}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid lg:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={
              ({ field }) => (
                <FormItem>
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

          <FormField
            control={form.control}
            name="domain"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {t("form.domain")}

                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipTrigger>

                        <TooltipContent>{tooltips.domain}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>

                  <FormControl>
                    <TextInput
                      {...field}
                      placeholder={t("form.placeholders.domain")}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
            }
          />

          <FormField
            control={form.control}
            name="countryId"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {t("form.country")}

                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipTrigger>

                        <TooltipContent>{tooltips.country}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>

                  <FormControl>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={value => field.onChange(Number(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("form.placeholders.country")} />
                      </SelectTrigger>

                      <SelectContent className="bg-white border shadow-md">
                        {
                          countryOptions.map(option => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
            }
          />

          <FormField
            control={form.control}
            name="search"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {t("form.search")}

                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipTrigger>

                        <TooltipContent>{tooltips.search}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>

                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={value => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("form.placeholders.search")} />
                      </SelectTrigger>

                      <SelectContent className="bg-white border shadow-md">
                        <SelectItem value="google">Google</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
            }
          />

          <FormField
            control={form.control}
            name="title"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {t("form.title")}

                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipTrigger>

                        <TooltipContent>
                          <Image
                            src="/images/tooltip/discription_web_title_example.png"
                            alt="Title tooltip"
                            width={300}
                            height={300}
                          />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>

                  <FormControl>
                    <TextInput
                      {...field}
                      placeholder={t("form.placeholders.title")}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
            }
          />

          <FormField
            control={form.control}
            name="device"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {t("form.device")}

                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipTrigger>

                        <TooltipContent>{tooltips.device}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>

                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={value => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("form.placeholders.device")} />
                      </SelectTrigger>

                      <SelectContent className="bg-white border shadow-md">
                        {
                          DeviceOptions.map(option => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
            }
          />

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
