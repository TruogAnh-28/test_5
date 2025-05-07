"use client"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  useTranslations,
} from "next-intl"

import {
  getTrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/api/traffic-seo-campaigns"
import {
  TrafficSeoCampaignsForm,
} from "~/features/traffic-seo-campaigns/components/forms/traffic-seo-campaigns-form"
import {
  Loading,
} from "~/shared/components/shared/loading"

export function UpdateTrafficSeoCampaigns({ id }: { id: number }) {
  const t = useTranslations("trafficSeoCampaigns")
  const {
    data: trafficSeoCampaigns, isLoading,
  } = useQuery({
    queryKey: ["getTrafficSeoCampaigns"],
    queryFn: () => getTrafficSeoCampaigns({
      id,
    }),
  })
  if (isLoading) return <Loading />
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-row items-center justify-between">

        <h1 className="text-xl font-semibold capitalize">{t("titleUpdate")}</h1>

      </div>

      <TrafficSeoCampaignsForm
        values={trafficSeoCampaigns?.data}
      />
    </div>
  )
}
