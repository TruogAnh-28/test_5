import {
  type SearchSubmitlinkCampaigns, type SearchSubmitlinkCampaignsResponse,
  type SubmitlinkCampaigns, type SubmitlinkCampaignsInput,
  type CreateCampaignDetailResponse,
  type CampaignDetailResponse,
} from "~/features/submitlink-campaigns/type/submitlink-campaigns"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const getAllSubmitlinkCampaigns = async () => {
  const response = await api.get<ApiResponse<SubmitlinkCampaigns[]>>("/submitlink-campaigns")
  return response
}

export const getSubmitlinkCampaigns = async (data: {
  id: number
}) => {
  const response = await api.get<ApiResponse<SubmitlinkCampaigns>>(`/campaigns/${data.id}`)
  return response
}

export const createSubmitlinkCampaigns = async (data: SubmitlinkCampaignsInput) => {
  const response = await api.post<ApiResponse<CreateCampaignDetailResponse>>(
    "/campaigns", data
  )
  return response
}

export const deleteSubmitlinkCampaigns = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(`/submitlink-campaigns/${id}`)
  return response
}
export const pausedTrafficCampaign = async (id: number) => {
  const response = await api.put<ApiResponse<null>>(
    `/campaigns/cancel/${id}`, ""
  )
  return response
}
export const searchSubmitlinkCampaigns = async (filters: SearchSubmitlinkCampaigns) => {
  // Create a new object to avoid modifying the original
  const searchParams: Record<string, any> = {
    ...filters,
    campaignTypeId: 3,
  }

  const response = await api.post<ApiResponse<SearchSubmitlinkCampaignsResponse>>(
    "/campaigns/search", searchParams
  )
  return response
}
export const getDetailCampaign = async (campaignId: number) => {
  const response = await api.get<ApiResponse<CampaignDetailResponse>>(`/campaigns/${campaignId}`)
  return response
}
