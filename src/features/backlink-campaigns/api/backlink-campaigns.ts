import {
  type SearchBacklinkCampaigns,
  type BacklinkCampaigns,
  type BacklinkCampaignsInput,
} from "~/features/backlink-campaigns/type/backlink-campaigns"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const getAllBacklinkCampaigns = async () => {
  const response = await api.get<ApiResponse<BacklinkCampaigns[]>>("/backlink-campaigns")
  return response
}

export const getBacklinkCampaigns = async (data: {
  id: number
}) => {
  const response = await api.get<ApiResponse<BacklinkCampaigns>>(`/backlink-campaigns/${data.id}`)
  return response
}

export const createBacklinkCampaigns = async (data: BacklinkCampaignsInput) => {
  const response = await api.post<ApiResponse<null>>(
    "/backlink-campaigns", data
  )
  return response
}

export const updateBacklinkCampaigns = async (
  id: number, data: BacklinkCampaignsInput
) => {
  const response = await api.put<ApiResponse<null>>(
    `/backlink-campaigns/${id}`, data
  )
  return response
}

export const deleteBacklinkCampaigns = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(`/backlink-campaigns/${id}`)
  return response
}

export const updateAvatar = async (data: {
  image_link: string | undefined
}) => {
  const response = await api.post<ApiResponse<null>>(
    "/backlink-campaigns/updateAvatar", data
  )
  return response
}

export const searchBacklinkCampaigns = async (data: SearchBacklinkCampaigns) => {
  // Transform to match the API expected format
  const apiFilters = {
    userId: data.userId,
    device: data.device,
    status: data.status,
    campaignTypeId: 2,
    startDate: data.date_range?.start_date,
    endDate: data.date_range?.end_date,
    domain: data.domain,
    page: data.page,
    limit: data.limit,
    key: data.key,
  }

  const response = await api.post<ApiResponse<{
    campaigns: BacklinkCampaigns[]
    total: number
  }>>(
    "/campaigns/search", apiFilters
  )

  return {
    ...response,
    data: {
      list: response.data.campaigns || [],
      total: response.data.total || 0,
    },
  }
}
