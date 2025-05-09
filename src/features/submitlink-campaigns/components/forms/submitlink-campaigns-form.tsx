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
  formatDateToUTC,
} from "~/shared/utils/date"

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
    linkCount,
    setLinkCount,
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

  // Cost per link
  const linkCost = Number(configs.find(c => c.name === "LINK_COST")?.value || "1")

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
    startDate: tomorrow.toISOString(),
    endDate: defaultEndDate.toISOString(),
    // Default values that will be set but not shown to user
    type: "submitlink",
    device: "all",
    title: "Submitlink Campaign",
    domain: "example.com",
    search: "google",
    status: "ACTIVE",
    links: [],
    countryId: 1,
  }

  if (props.values) {
    Object.assign(
      initialValues, {
        ...props.values,
        startDate: props.values.startDate,
        endDate: props.values.endDate,
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
        if (name?.includes("links")) {
          const currentLinks = form.getValues("links") || []
          const count = currentLinks.length
          const cost = count * linkCost

          setLinkCount(count)
          setCalculatedCost(cost)
        }
      })

      return () => subscription.unsubscribe()
    }, [
      form,
      linkCost,
    ]
  )

  useEffect(
    () => {
      const initialLinks = form.getValues("links") || []
      const count = initialLinks.length
      const cost = count * linkCost

      setLinkCount(count)
      setCalculatedCost(cost)
    }, [
      linkCost,
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
          campaignTypeId: 3,
          startDate: formatDateToUTC(data.startDate),
          endDate: formatDateToUTC(data.endDate),
          type: "submitlink",
          device: "all",
          title: "Submitlink Campaign",
          domain: "example.com",
          search: "google",
          status: "ACTIVE",
          countryId: 1,
          links: data.links.map(link => ({
            link: link.link,
            linkTo: "default.com",
            distribution: "DAY",
            traffic: 0,
            anchorText: "",
            status: "ACTIVE",
            url: "",
            page: "",
          })),
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
        linkCount={linkCount}
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
          linkCost={linkCost}
        />
      </div>
    </AppForm>
  )
}
