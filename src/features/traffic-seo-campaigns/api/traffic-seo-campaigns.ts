import {
  type SearchTrafficSeoCampaigns, type SearchTrafficSeoCampaignsResponse,
  type TrafficSeoCampaigns, type TrafficSeoCampaignsInput,
  type CreateCampaignDetailResponse,
  type CampaignDetailResponse,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const getAllTrafficSeoCampaigns = async () => {
  const response = await api.get<ApiResponse<TrafficSeoCampaigns[]>>("/traffic-seo-campaigns")
  return response
}

export const getTrafficSeoCampaigns = async (data: {
  id: number
}) => {
  const response = await api.get<ApiResponse<TrafficSeoCampaigns>>(`/campaigns/${data.id}`)
  return response
}

export const createTrafficSeoCampaigns = async (data: TrafficSeoCampaignsInput) => {
  const response = await api.post<ApiResponse<CreateCampaignDetailResponse>>(
    "/campaigns", data
  )
  return response
}

export const deleteTrafficSeoCampaigns = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(`/traffic-seo-campaigns/${id}`)
  return response
}
export const pausedTrafficCampaign = async (id: number) => {
  const response = await api.put<ApiResponse<null>>(
    `/campaigns/cancel/${id}`, ""
  )
  return response
}
export const searchTrafficSeoCampaigns = async (filters: SearchTrafficSeoCampaigns) => {
  // Create a new object to avoid modifying the original
  const searchParams: Record<string, any> = {
    ...filters,
    campaignTypeId: 1,
  }

  const response = await api.post<ApiResponse<SearchTrafficSeoCampaignsResponse>>(
    "/campaigns/search", searchParams
  )
  return response
}
export const getDetailCampaign = async (campaignId: number) => {
  const response = await api.get<ApiResponse<CampaignDetailResponse>>(`/campaigns/${campaignId}`)
  return response
}
