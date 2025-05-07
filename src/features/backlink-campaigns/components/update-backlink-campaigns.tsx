"use client"

import {
  useQuery,
} from "@tanstack/react-query"

import {
  getBacklinkCampaigns,
} from "~/features/backlink-campaigns/api/backlink-campaigns"
import {
  BacklinkCampaignsForm,
} from "~/features/backlink-campaigns/components/forms/backlink-campaigns-form"
import {
  Loading,
} from "~/shared/components/shared/loading"

export function UpdateBacklinkCampaigns({ id }: { id: number }) {
  const {
    data: backlinkCampaigns, isLoading,
  } = useQuery({
    queryKey: ["getBacklinkCampaigns"],
    queryFn: () => getBacklinkCampaigns({
      id,
    }),
  })
  if (isLoading) return <Loading />
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-row items-center justify-between">

        <h1 className="text-xl font-semibold capitalize">Chỉnh sửa chiến dịch</h1>

      </div>

      <BacklinkCampaignsForm
        values={backlinkCampaigns?.data}
      />
    </div>
  )
}
