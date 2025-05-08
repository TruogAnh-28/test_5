/* eslint-disable react/no-array-index-key */
import React, {
  useState, useEffect,
} from "react"

import {
  ChevronDown, ChevronRight, Plus, Trash, HelpCircle, Calculator,
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

interface CampaignKeywordsProps {
  form: UseFormReturn<TrafficSeoCampaignsInput>
  keywordRateCost: number
  tooltips: {
    keyword: string
    traffic: string
    distribution: string
    urls: string
  }
}

export function CampaignKeywords({
  form, keywordRateCost, tooltips,
}: CampaignKeywordsProps) {
  const t = useTranslations("trafficSeoCampaigns")

  const {
    fields: keywordFields, append: appendKeyword, remove: removeKeyword,
  } = useFieldArray({
    control: form.control,
    name: "keywords",
  })

  const [
    openKeywordItems,
    setOpenKeywordItems,
  ] = useState<Record<number, boolean>>({
  })

  const [
    dailyTrafficEstimates,
    setDailyTrafficEstimates,
  ] = useState<Record<number, string>>({
  })

  const toggleKeywordItem = (index: number) => {
    setOpenKeywordItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Calculate total traffic from all keywords
  const totalKeywordTraffic = form.watch("keywords")?.reduce(
    (
      sum, keyword
    ) => sum + (keyword.traffic || 0),
    0
  ) || 0

  // Distribution options as a select
  const DistributionOptions = [
    {
      label: t("form.distributionOptions.day"),
      value: "DAY",
    },
    // {
    //   label: t("form.distributionOptions.month"),
    //   value: "MONTH",
    // },
    // {
    //   label: t("form.distributionOptions.year"),
    //   value: "YEAR",
    // },
  ]

  useEffect(
    () => {
      const subscription = form.watch((
        value, { name }
      ) => {
        if ((name && name.includes("keywords") && name.includes("traffic"))
          || name === "startDate" || name === "endDate") {
          calculateDailyTraffic()
        }
      })

      return () => subscription.unsubscribe()
    }, [form]
  )

  useEffect(
    () => {
      calculateDailyTraffic()
    }, [form.watch("keywords")?.length]
  )

  const calculateDailyTraffic = () => {
    const startDateStr = form.watch("startDate")
    const endDateStr = form.watch("endDate")
    const keywords = form.watch("keywords") || []

    if (!startDateStr || !endDateStr) return

    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)

    const daysDiff = Math.max(
      1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    )

    const dailyEstimates = keywords.reduce(
      (
        acc, keyword, index
      ) => {
        const getEstimate = () => {
          // if (!keyword.traffic) return "0"

          const dailyTraffic = keyword.traffic / daysDiff
          const dailyTrafficRounded = Math.round(dailyTraffic * 10) / 10

          return Number.isInteger(dailyTrafficRounded)
            ? dailyTrafficRounded.toString()
            : `~${Math.floor(dailyTrafficRounded)}-${Math.ceil(dailyTrafficRounded)}`
        }

        return {
          ...acc,
          [index]: getEstimate(),
        }
      }, {
      }
    )

    setDailyTrafficEstimates(dailyEstimates)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>{t("form.keywords.title")}</CardTitle>

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

                {totalKeywordTraffic.toLocaleString()}
              </Badge>
            </div>

            <Button
              type="button"
              onClick={
                () => {
                  const newIndex = keywordFields.length
                  appendKeyword({
                    name: "",
                    urls: [""],
                    distribution: "DAY",
                    traffic: 0,
                  })
                  setOpenKeywordItems(prev => ({
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

              {t("form.keywords.add")}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {
            keywordFields.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                {t("form.keywords.empty")}
              </p>
            )
          }

          {
            keywordFields.map((
              field, index
            ) => (
              <Collapsible
                key={field.id}
                open={openKeywordItems[index]}
                onOpenChange={() => toggleKeywordItem(index)}
                className="border rounded-lg"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto flex items-center gap-2 hover:bg-transparent"
                      >
                        {openKeywordItems[index] ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}

                        <div className="flex items-center">
                          <h4 className="text-sm font-semibold">
                            {t("form.keywords.keyword")}

                            {" "}

                            #
                            {index + 1}

                            {form.watch(`keywords.${index}.name`) ? `: ${form.watch(`keywords.${index}.name`)}` : ""}
                          </h4>
                        </div>
                      </Button>
                    </CollapsibleTrigger>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="mr-2"
                      >
                        {t("form.keywords.traffic")}

                        :

                        {" "}

                        {form.watch(`keywords.${index}.traffic`)?.toLocaleString() || 0}
                      </Badge>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeKeyword(index)}
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
                        name={`keywords.${index}.name`}
                        render={
                          ({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("form.keywords.name")}

                                <TooltipProvider>
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                                    </TooltipTrigger>

                                    <TooltipContent>{tooltips.keyword}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>

                              <FormControl>
                                <TextInput
                                  {...field}
                                  placeholder={t("form.keywords.placeholders.name")}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )
                        }
                      />

                      <FormField
                        control={form.control}
                        name={`keywords.${index}.traffic`}
                        render={
                          ({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("form.keywords.traffic")}

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
                                  placeholder={t("form.keywords.placeholders.traffic")}
                                  onValueChange={
                                    (values) => {
                                      field.onChange(values.floatValue || 0)
                                      // Force immediate recalculation after traffic change
                                      setTimeout(
                                        () => calculateDailyTraffic(), 0
                                      )
                                    }
                                  }
                                  value={field.value}
                                />
                              </FormControl>

                              <div className="flex flex-col space-y-1 mt-1">
                                <p className="text-xs text-muted-foreground">
                                  {t("form.keywords.costCalculation")}

                                  :

                                  {" "}

                                  {field.value || 0}

                                  ×

                                  {keywordRateCost}

                                  {" "}

                                  =

                                  {" "}

                                  {((field.value || 0) * keywordRateCost).toFixed(2)}

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
                        name={`keywords.${index}.distribution`}
                        render={
                          ({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("form.keywords.distribution")}

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
                    </div>

                    <FormField
                      control={form.control}
                      name={`keywords.${index}.urls`}
                      render={
                        ({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("form.keywords.urls")}

                              <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="ml-1 size-4 inline text-muted-foreground hover:text-foreground cursor-help" />
                                  </TooltipTrigger>

                                  <TooltipContent>{tooltips.urls}</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormLabel>

                            <div className="space-y-2">
                              {
                                field.value
                                  ? field.value.map((
                                    url, urlIndex
                                  ) => (
                                    <div
                                      key={`url-${urlIndex}`}
                                      className="flex gap-2"
                                    >
                                      <FormControl>
                                        <TextInput
                                          value={url}
                                          onChange={
                                            (e) => {
                                              const newUrls = [...field.value]
                                              newUrls[urlIndex] = e.target.value
                                              field.onChange(newUrls)
                                            }
                                          }
                                          placeholder={t("form.keywords.placeholders.url")}
                                          className="flex-1"
                                          key={`url-input-${urlIndex}`}
                                        />
                                      </FormControl>

                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={
                                          () => {
                                            const newUrls = [...field.value]
                                            newUrls.splice(
                                              urlIndex, 1
                                            )
                                            field.onChange(newUrls)
                                          }
                                        }
                                        className="size-8 hover:text-destructive hover:bg-destructive/20"
                                      >
                                        <Trash className="size-4" />
                                      </Button>
                                    </div>
                                  ))
                                  : null
                              }

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={
                                  () => field.onChange([
                                    ...(field.value || []),
                                    "",
                                  ])
                                }
                                className="w-full"
                              >
                                <Plus className="size-4 mr-2" />

                                {t("form.keywords.addUrl")}
                              </Button>
                            </div>

                            <FormMessage />
                          </FormItem>
                        )
                      }
                    />
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
