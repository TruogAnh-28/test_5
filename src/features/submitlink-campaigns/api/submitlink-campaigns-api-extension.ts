import {
  type Link,
  type LinkDetailResponse,
} from "~/features/submitlink-campaigns/type/submitlink-campaigns"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

// Link API functions
export const updateLinkApi = async (link: Link) => {
  const response = await api.put<ApiResponse<null>>(
    `/submitlink-campaigns/links/${link.id}`,
    link
  )
  return response
}

export const addLinkApi = async (link: Link) => {
  const response = await api.post<ApiResponse<null>>(
    "/submitlink-campaigns/links",
    link
  )
  return response
}

export const deleteLinkApi = async (linkId: number) => {
  const response = await api.delete<ApiResponse<null>>(`/submitlink-campaigns/links/${linkId}`)
  return response
}

export const getLinkByCampaign = async (campaignId: number) => {
  const response = await api.get<ApiResponse<LinkDetailResponse[]>>(`/links/campaign/${campaignId}`)
  return response
}
