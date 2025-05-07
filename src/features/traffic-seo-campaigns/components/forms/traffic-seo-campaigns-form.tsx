"use client"

import React, {
  useEffect, useCallback, useState,
} from "react"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  useQuery,
} from "@tanstack/react-query"
import {
  useSession,
} from "next-auth/react"
import {
  useTranslations,
} from "next-intl"
import {
  type SubmitHandler, useForm,
} from "react-hook-form"
import {
  toast,
} from "sonner"

import {
  createTrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/api/traffic-seo-campaigns"
import {
  CampaignBasicInfo,
} from "~/features/traffic-seo-campaigns/components/forms/campaign-basic-info"
import {
  CampaignKeywords,
} from "~/features/traffic-seo-campaigns/components/forms/campaign-keywords"
// import {
//   CampaignLinks,
// } from "~/features/traffic-seo-campaigns/components/forms/campaign-links"
import {
  CampaignSummary,
} from "~/features/traffic-seo-campaigns/components/forms/campaign-summary"
import {
  type TrafficSeoCampaigns, type TrafficSeoCampaignsInput,
  createTrafficSeoSchemas,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  useRouter,
} from "~/i18n"
import {
  api,
} from "~/lib/modules/api"
import {
  AppForm, type BaseAppFormProps,
} from "~/shared/components/forms/app-form"

interface Config {
  id: number
  name: string
  value: string
  createdAt: string
  updatedAt: string
}

interface Country {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface TrafficSeoCampaignsFormProps extends BaseAppFormProps {
  onSubmitSuccess?: () => void
  values?: TrafficSeoCampaigns
}

export function TrafficSeoCampaignsForm({
  onSubmitSuccess, ...props
}: TrafficSeoCampaignsFormProps) {
  const t = useTranslations("trafficSeoCampaigns")
  const { data: session } = useSession()
  const { trafficSeoCampaignsSchema } = createTrafficSeoSchemas(t)
  const router = useRouter()

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  const [
    calculatedTraffic,
    setCalculatedTraffic,
  ] = useState(0)
  const [
    calculatedCost,
    setCalculatedCost,
  ] = useState(0)

  const { data: countriesResponse } = useQuery({
    queryKey: ["getCountries"],
    queryFn: async () => {
      const response = await api.get<{ data: Country[] }>("/countries")
      return response
    },
  })

  const countries = countriesResponse?.data || []

  const { data: configsResponse } = useQuery({
    queryKey: ["getConfigs"],
    queryFn: async () => {
      const response = await api.get<{ data: Config[] }>("/configs")
      return response
    },
  })

  const configs = configsResponse?.data || []

  const keywordTrafficCost = Number(configs.find(c => c.name === "KEYWORD_TRAFFIC_COST")?.value || "1")
  const linkTrafficCost = Number(configs.find(c => c.name === "LINK_TRAFFIC_COST")?.value || "1")

  const handleSubmitSuccess = (id?: number) => {
    form.reset()
    if (id) {
      router.push(`/traffic-seo-campaigns/${id}`)
    }
    else {
      router.push("/traffic-seo-campaigns")
    }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(
    0, 0, 0, 0
  )

  const defaultEndDate = new Date(tomorrow)
  defaultEndDate.setDate(defaultEndDate.getDate() + 30)

  const initialValues: Partial<TrafficSeoCampaignsInput> = {
    name: "",
    type: "traffic-seo",
    device: "all",
    title: "",
    startDate: tomorrow.toISOString(),
    endDate: defaultEndDate.toISOString(),
    domain: "",
    search: "google",
    status: "ACTIVE",
    keywords: [],
    links: [],
    countryId: 1,
  }

  if (props.values) {
    Object.assign(
      initialValues, {
        ...props.values,
        startDate: props.values.startDate instanceof Date ? props.values.startDate.toISOString() : props.values.startDate,
        endDate: props.values.endDate instanceof Date ? props.values.endDate.toISOString() : props.values.endDate,
        keywords: props.values.keywords?.map(keyword => ({
          ...keyword,
          urls: keyword.urls || [],
        })) || [],
        links: props.values.links || [],
      }
    )
  }

  const form = useForm<TrafficSeoCampaignsInput>({
    resolver: zodResolver(trafficSeoCampaignsSchema),
    defaultValues: initialValues,
  })

  useEffect(
    () => {
      const subscription = form.watch((
        value, { name }
      ) => {
        if (
          name?.includes("keywords")
          || name?.includes("links")
          || name === "startDate"
          || name === "endDate"
        ) {
          const currentKeywords = form.getValues("keywords") || []
          const currentLinks = form.getValues("links") || []

          const keywordTraffic = currentKeywords.reduce(
            (
              sum, keyword
            ) => sum + (keyword?.traffic || 0), 0
          )
          const linkTraffic = currentLinks.reduce(
            (
              sum, link
            ) => sum + (link?.traffic || 0), 0
          )
          const totalTraffic = keywordTraffic + linkTraffic
          const keywordCost = keywordTraffic * keywordTrafficCost
          const linkCost = linkTraffic * linkTrafficCost
          const totalCost = keywordCost + linkCost

          setCalculatedTraffic(totalTraffic)
          setCalculatedCost(totalCost)
        }
      })

      return () => subscription.unsubscribe()
    }, [
      form,
      keywordTrafficCost,
      linkTrafficCost,
    ]
  )

  useEffect(
    () => {
      const initialKeywords = form.getValues("keywords") || []
      const initialLinks = form.getValues("links") || []

      const keywordTraffic = initialKeywords.reduce(
        (
          sum, keyword
        ) => sum + (keyword?.traffic || 0), 0
      )
      const linkTraffic = initialLinks.reduce(
        (
          sum, link
        ) => sum + (link?.traffic || 0), 0
      )
      const totalTraffic = keywordTraffic + linkTraffic

      const keywordCost = keywordTraffic * keywordTrafficCost
      const linkCost = linkTraffic * linkTrafficCost
      const totalCost = keywordCost + linkCost

      setCalculatedTraffic(totalTraffic)
      setCalculatedCost(totalCost)
    }, [
      keywordTrafficCost,
      linkTrafficCost,
      form,
    ]
  )

  const handleSubmit: SubmitHandler<TrafficSeoCampaignsInput> = useCallback(
    async (data) => {
      if (isSubmitting) return

      setIsSubmitting(true)

      try {
        const formattedData = {
          ...data,
          userId: session?.user?.id,
          campaignTypeId: 1,
          totalTraffic: undefined,
          cost: undefined,
        }

        if (props.isCreate) {
          const response = await createTrafficSeoCampaigns(formattedData)
          toast.success(response.message || t("form.successMessages.create"))
          handleSubmitSuccess(response.data ? response.data.id : undefined)
          onSubmitSuccess?.()
        }
      }
      catch (error) {
        form.setError(
          "root", {
            message: (error as Error).message ?? t("form.errorMessages.requestFailed"),
          }
        )
      }
      finally {
        setIsSubmitting(false)
      }
    }, [
      isSubmitting,
      onSubmitSuccess,
      props,
      session,
      t,
      router,
    ]
  )

  return (
    <AppForm
      {...props}
      form={form}
      onSubmit={handleSubmit}
      title={t("form.sectionInfo")}
      isSubmitDisabled={isSubmitting}
    >
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">{t("titleCreate")}</h1>
      </div>

      {
        isSubmitting ? (
          <div className="flex justify-center py-2">
            <div className="text-blue-600">
              {t("form.submitting") || "Processing your request..."}
            </div>
          </div>
        ) : null
      }

      <CampaignSummary
        totalTraffic={calculatedTraffic}
        totalCost={calculatedCost}
      />

      <div className="space-y-8">
        <CampaignBasicInfo
          form={form}
          countries={countries}
          tooltips={
            {
              name: t("tooltips.name"),
              domain: t("tooltips.domain"),
              search: t("tooltips.search"),
              title: t("tooltips.title"),
              startDate: t("tooltips.startDate"),
              endDate: t("tooltips.endDate"),
              device: t("tooltips.device"),
              status: t("tooltips.status"),
              country: t("tooltips.country"),
            }
          }
        />

        <CampaignKeywords
          form={form}
          keywordRateCost={keywordTrafficCost}
          tooltips={
            {
              keyword: t("tooltips.keyword"),
              traffic: t("tooltips.keywordTraffic"),
              distribution: t("tooltips.distribution"),
              urls: t("tooltips.url"),
            }
          }
        />

        {/* <CampaignLinks
          form={form}
          linkRateCost={linkTrafficCost}
          tooltips={
            {
              link: t("tooltips.link"),
              linkTarget: t("tooltips.linkTarget"),
              traffic: t("tooltips.linkTraffic"),
              distribution: t("tooltips.distribution"),
              anchorText: t("tooltips.anchorText"),
              status: t("tooltips.status"),
              url: t("tooltips.url"),
              page: t("tooltips.page"),
            }
          }
        /> */}
      </div>
    </AppForm>
  )
}
