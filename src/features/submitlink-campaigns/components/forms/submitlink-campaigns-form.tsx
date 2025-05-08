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
  createSubmitlinkCampaigns,
} from "~/features/submitlink-campaigns/api/submitlink-campaigns"
import {
  CampaignBasicInfo,
} from "~/features/submitlink-campaigns/components/forms/campaign-basic-info"
import {
  CampaignLinks,
} from "~/features/submitlink-campaigns/components/forms/campaign-links"
import {
  CampaignSummary,
} from "~/features/submitlink-campaigns/components/forms/campaign-summary"
import {
  type SubmitlinkCampaigns, type SubmitlinkCampaignsInput,
  createSubmitlinkSchemas,
} from "~/features/submitlink-campaigns/type/submitlink-campaigns"
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

export interface SubmitlinkCampaignsFormProps extends BaseAppFormProps {
  onSubmitSuccess?: () => void
  values?: SubmitlinkCampaigns
}

export function SubmitlinkCampaignsForm({
  onSubmitSuccess, ...props
}: SubmitlinkCampaignsFormProps) {
  const t = useTranslations("submitlinkCampaigns")
  const { data: session } = useSession()
  const { submitlinkCampaignsSchema } = createSubmitlinkSchemas(t)
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

  const { data: configsResponse } = useQuery({
    queryKey: ["getConfigs"],
    queryFn: async () => {
      const response = await api.get<{ data: Config[] }>("/configs")
      return response
    },
  })

  const configs = configsResponse?.data || []

  const linkTrafficCost = Number(configs.find(c => c.name === "LINK_TRAFFIC_COST")?.value || "1")

  const handleSubmitSuccess = (id?: number) => {
    form.reset()
    if (id) {
      router.push(`/submitlink-campaigns/${id}`)
    }
    else {
      router.push("/submitlink-campaigns")
    }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(
    0, 0, 0, 0
  )

  const defaultEndDate = new Date(tomorrow)
  defaultEndDate.setDate(defaultEndDate.getDate() + 30)

  const initialValues: Partial<SubmitlinkCampaignsInput> = {
    name: "",
    type: "submitlink",
    device: "all",
    title: "",
    startDate: tomorrow.toISOString(),
    endDate: defaultEndDate.toISOString(),
    domain: "",
    search: "google",
    status: "ACTIVE",
    links: [],
    countryId: 1,
  }

  if (props.values) {
    Object.assign(
      initialValues, {
        ...props.values,
        startDate: props.values.startDate instanceof Date ? props.values.startDate.toISOString() : props.values.startDate,
        endDate: props.values.endDate instanceof Date ? props.values.endDate.toISOString() : props.values.endDate,
        links: props.values.links || [],
      }
    )
  }

  const form = useForm<SubmitlinkCampaignsInput>({
    resolver: zodResolver(submitlinkCampaignsSchema),
    defaultValues: initialValues,
  })

  useEffect(
    () => {
      const subscription = form.watch((
        value, { name }
      ) => {
        if (
          name?.includes("links")
          || name === "startDate"
          || name === "endDate"
        ) {
          const currentLinks = form.getValues("links") || []

          const linkTraffic = currentLinks.reduce(
            (
              sum, link
            ) => sum + (link?.traffic || 0), 0
          )

          const totalTraffic = linkTraffic
          const linkCost = linkTraffic * linkTrafficCost
          const totalCost = linkCost

          setCalculatedTraffic(totalTraffic)
          setCalculatedCost(totalCost)
        }
      })

      return () => subscription.unsubscribe()
    }, [
      form,
      linkTrafficCost,
    ]
  )

  useEffect(
    () => {
      const initialLinks = form.getValues("links") || []

      const linkTraffic = initialLinks.reduce(
        (
          sum, link
        ) => sum + (link?.traffic || 0), 0
      )

      const totalTraffic = linkTraffic
      const linkCost = linkTraffic * linkTrafficCost
      const totalCost = linkCost

      setCalculatedTraffic(totalTraffic)
      setCalculatedCost(totalCost)
    }, [
      linkTrafficCost,
      form,
    ]
  )

  const handleSubmit: SubmitHandler<SubmitlinkCampaignsInput> = useCallback(
    async (data) => {
      if (isSubmitting) return

      setIsSubmitting(true)

      try {
        const formattedData = {
          ...data,
          userId: session?.user?.id,
          campaignTypeId: 3, // Use 3 for submitlink campaigns
          totalTraffic: calculatedTraffic,
          cost: calculatedCost,
        }

        if (props.isCreate) {
          const response = await createSubmitlinkCampaigns(formattedData)
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
        toast.error(t("form.errorMessages.requestFailed"))
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
      calculatedTraffic,
      calculatedCost,
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
          tooltips={
            {
              name: t("tooltips.name"),
              startDate: t("tooltips.startDate"),
              endDate: t("tooltips.endDate"),
            }
          }
        />

        <CampaignLinks
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
        />
      </div>
    </AppForm>
  )
}
