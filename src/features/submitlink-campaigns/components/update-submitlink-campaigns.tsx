"use client"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  useTranslations,
} from "next-intl"

import {
  getSubmitlinkCampaigns,
} from "~/features/submitlink-campaigns/api/submitlink-campaigns"
import {
  SubmitlinkCampaignsForm,
} from "~/features/submitlink-campaigns/components/forms/submitlink-campaigns-form"
import {
  Loading,
} from "~/shared/components/shared/loading"

export function UpdateSubmitlinkCampaigns({ id }: { id: number }) {
  const t = useTranslations("submitlinkCampaigns")
  const {
    data: submitlinkCampaigns, isLoading,
  } = useQuery({
    queryKey: ["getSubmitlinkCampaigns"],
    queryFn: () => getSubmitlinkCampaigns({
      id,
    }),
  })
  if (isLoading) return <Loading />
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold capitalize">{t("titleUpdate")}</h1>
      </div>

      <SubmitlinkCampaignsForm
        values={submitlinkCampaigns?.data}
      />
    </div>
  )
}
