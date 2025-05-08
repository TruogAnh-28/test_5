import React, {
  useState, useEffect,
} from "react"

import {
  ChevronDown, ChevronRight, Link as LinkIcon, Plus, Trash, HelpCircle, Calculator,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"
import {
  type UseFormReturn, useFieldArray,
} from "react-hook-form"

import {
  type TrafficSeoCampaignsInput,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  NumericInput,
} from "~/shared/components/inputs/numeric-input"
import {
  TextInput,
} from "~/shared/components/inputs/text-input"
import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "~/shared/components/ui/card"
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "~/shared/components/ui/collapsible"
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

interface CampaignLinksProps {
  form: UseFormReturn<TrafficSeoCampaignsInput>
  linkRateCost: number
  tooltips: {
    link: string
    linkTarget: string
    traffic: string
    distribution: string
    anchorText: string
    status: string
    url: string
    page: string
  }
}

export function CampaignLinks({
  form, linkRateCost, tooltips,
}: CampaignLinksProps) {
  const t = useTranslations("trafficSeoCampaigns")

  const {
    fields: linkFields, append: appendLink, remove: removeLink,
  } = useFieldArray({
    control: form.control,
    name: "links",
  })

  const [
    openLinkItems,
    setOpenLinkItems,
  ] = useState<Record<number, boolean>>({
  })

  const [
    dailyTrafficEstimates,
    setDailyTrafficEstimates,
  ] = useState<Record<number, string>>({
  })

  const toggleLinkItem = (index: number) => {
    setOpenLinkItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Calculate total traffic from all links
  const totalLinkTraffic = form.watch("links")?.reduce(
    (
      sum, link
    ) => sum + (link.traffic || 0),
    0
  ) || 0

  // Status options for links
  const StatusOptions = [
    {
      label: t("statusOptions.active"),
      value: "ACTIVE",
    },
    {
      label: t("statusOptions.inactive"),
      value: "INACTIVE",
    },
    {
      label: t("statusOptions.processing"),
      value: "PROCESSING",
    },
  ]

  const DistributionOptions = [
    {
      label: t("form.distributionOptions.day"),
      value: "DAY",
    },
    {
      label: t("form.distributionOptions.month"),
      value: "MONTH",
    },
    {
      label: t("form.distributionOptions.year"),
      value: "YEAR",
    },
  ]

  useEffect(
    () => {
      const startDateStr = form.watch("startDate")
      const endDateStr = form.watch("endDate")
      const links = form.watch("links") || []

      if (!startDateStr || !endDateStr) return

      const startDate = new Date(startDateStr)
      const endDate = new Date(endDateStr)

      const daysDiff = Math.max(
        1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      )

      const dailyEstimates: Record<number, string> = {
      }
      links.forEach((
        link, index
      ) => {
        const traffic = link.traffic || 0

        const dailyTraffic = traffic / daysDiff
        const dailyTrafficRounded = Math.round(dailyTraffic * 10) / 10

        dailyEstimates[index] = Number.isInteger(dailyTrafficRounded)
          ? dailyTrafficRounded.toString()
          : `~${Math.floor(dailyTrafficRounded)}-${Math.ceil(dailyTrafficRounded)}`
      })

      setDailyTrafficEstimates(dailyEstimates)
    }, [
      form.watch("startDate"),
      form.watch("endDate"),
      form.watch("links"),
    ]
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>{t("form.links.title")}</CardTitle>

          {/* Add link traffic and cost summary */}
          <div className="flex items-center space-x-4">
            <div className="text-sm flex items-center">
              <Badge
                variant="secondary"
                className="mr-2"
              >
                <Calculator className="mr-1 size-3" />

                {t("form.summary.traffic")}

                :
                {" "}

                {totalLinkTraffic.toLocaleString()}
              </Badge>
            </div>

            <Button
              type="button"
              onClick={
                () => {
                  const newIndex = linkFields.length
                  appendLink({
                    link: "",
                    linkTo: "",
                    distribution: "DAY",
                    traffic: 0,
                    anchorText: "",
                    status: "ACTIVE",
                    url: "",
                    page: "",
                  })
                  // Automatically open new link
                  setOpenLinkItems(prev => ({
                    ...prev,
                    [newIndex]: true,
                  }))
                }
              }
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              <Plus className="size-4 mr-2" />

              {t("form.links.add")}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {
            linkFields.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                {t("form.links.empty")}
              </p>
            )
          }

          {
            linkFields.map((
              field, index
            ) => (
              <Collapsible
                key={field.id}
                open={openLinkItems[index]}
                onOpenChange={() => toggleLinkItem(index)}
                className="border rounded-lg"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto flex items-center gap-2 hover:bg-transparent"
                      >
                        {openLinkItems[index] ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}

                        <div className="flex items-center">
                          <LinkIcon className="size-4 mr-2" />

                          <h4 className="text-sm font-semibold">
                            {t("form.links.link")}

                            {" "}

                            #
                            {index + 1}

                            {form.watch(`links.${index}.link`) ? `: ${form.watch(`links.${index}.link`)}` : ""}
                          </h4>
                        </div>
                      </Button>
                    </CollapsibleTrigger>

                    <div className="flex items-center gap-2">
                      {/* Show the traffic value */}
                      <Badge
                        variant="outline"
                        className="mr-2"
                      >
                        {t("form.links.traffic")}

                        :
                        {" "}

                        {form.watch(`links.${index}.traffic`)?.toLocaleString() || 0}
                      </Badge>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLink(index)}
                        className="size-8 hover:text-destructive hover:bg-destructive/20"
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-4">
                    <div className="grid lg:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`links.${index}.link`}
                        render={
                          ({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("form.links.linkSource")}

                                <TooltipProvider>
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                                    </TooltipTrigger>

                                    <TooltipContent>{tooltips.link}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>

                              <FormControl>
                                <TextInput
                                  {...field}
                                  placeholder={t("form.links.placeholders.linkSource")}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )
                        }
                      />

                      <FormField
                        control={form.control}
                        name={`links.${index}.linkTo`}
                        render={
                          ({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("form.links.linkTarget")}

                                <TooltipProvider>
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                                    </TooltipTrigger>

                                    <TooltipContent>{tooltips.linkTarget}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>

                              <FormControl>
                                <TextInput
                                  {...field}
                                  placeholder={t("form.links.placeholders.linkTarget")}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )
                        }
                      />

                      <FormField
                        control={form.control}
                        name={`links.${index}.distribution`}
                        render={
                          ({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("form.links.distribution")}

                                <TooltipProvider>
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                                    </TooltipTrigger>

                                    <TooltipContent>{tooltips.distribution}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>

                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={value => field.onChange(value)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t("form.distributionOptions.day")} />
                                  </SelectTrigger>

                                  <SelectContent className="bg-white border shadow-md">
                                    {
                                      DistributionOptions.map(option => (
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
                        name={`links.${index}.traffic`}
                        render={
                          ({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("form.links.traffic")}

                                <TooltipProvider>
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                                    </TooltipTrigger>

                                    <TooltipContent>{tooltips.traffic}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>

                              <FormControl>
                                <NumericInput
                                  placeholder={t("form.links.placeholders.traffic")}
                                  onValueChange={
                                    (values) => {
                                      field.onChange(values.floatValue || 0)
                                    }
                                  }
                                  value={field.value}
                                />
                              </FormControl>

                              <div className="flex flex-col space-y-1 mt-1">
                                <p className="text-xs text-muted-foreground">
                                  {t("form.links.costCalculation")}

                                  :

                                  {" "}

                                  {field.value || 0}

                                  {" "}

                                  ×
                                  {linkRateCost}

                                  {" "}

                                  =
                                  {" "}

                                  {((field.value || 0) * linkRateCost).toFixed(2)}

                                  {" "}
                                  credit
                                </p>

                                {
                                  dailyTrafficEstimates[index] ? (
                                    <p className="text-xs text-muted-foreground">
                                      Daily traffic:
                                      {" "}

                                      {dailyTrafficEstimates[index]}

                                      {" "}
                                      visitors/day
                                    </p>
                                  ) : null
                                }
                              </div>

                              <FormMessage />
                            </FormItem>
                          )
                        }
                      />

                      <FormField
                        control={form.control}
                        name={`links.${index}.anchorText`}
                        render={
                          ({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("form.links.anchorText")}

                                <TooltipProvider>
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                                    </TooltipTrigger>

                                    <TooltipContent>{tooltips.anchorText}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>

                              <FormControl>
                                <TextInput
                                  {...field}
                                  placeholder={t("form.links.placeholders.anchorText")}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )
                        }
                      />

                      <FormField
                        control={form.control}
                        name={`links.${index}.status`}
                        render={
                          ({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("form.links.status")}

                                <TooltipProvider>
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                                    </TooltipTrigger>

                                    <TooltipContent>{tooltips.status}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>

                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={value => field.onChange(value)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={StatusOptions[0].label} />
                                  </SelectTrigger>

                                  <SelectContent>
                                    {
                                      StatusOptions.map(option => (
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
                        name={`links.${index}.url`}
                        render={
                          ({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("form.links.url")}

                                <TooltipProvider>
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                                    </TooltipTrigger>

                                    <TooltipContent>{tooltips.url}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>

                              <FormControl>
                                <TextInput
                                  {...field}
                                  placeholder={t("form.links.placeholders.url")}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )
                        }
                      />

                      <FormField
                        control={form.control}
                        name={`links.${index}.page`}
                        render={
                          ({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("form.links.page")}

                                <TooltipProvider>
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                                    </TooltipTrigger>

                                    <TooltipContent>{tooltips.page}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>

                              <FormControl>
                                <TextInput
                                  {...field}
                                  placeholder={t("form.links.placeholders.page")}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )
                        }
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))
          }
        </div>
      </CardContent>
    </Card>
  )
}
