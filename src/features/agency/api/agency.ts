import {
  type AgencyInput,
  type Agency,
  type AgencyGetMe,
} from "~/features/agency/types/agency"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

// Register as an agency
export const registerAgency = async (data: AgencyInput) => {
  const response = await api.post<ApiResponse<Agency>>(
    "/agencies", data
  )
  return response
}

// Get agency info
export const getAgencyInfo = async () => {
  const response = await api.post<ApiResponse<AgencyGetMe>>(
    "/agencies/getMe", ""
  )
  return response
}

// Get agency statistics
export const getAgencyStats = async () => {
  const response = await api.get<ApiResponse<{
    total_referrals: number
    active_referrals: number
    total_earnings: number
    conversion_rate: number
    recent_referrals: Array<{
      id: number
      name: string
      email: string
      registered_at: string
    }>
  }>>("/agency/stats")
  return response
}

export const searchAgencyReferrals = async (params: {
  key?: string
  page: number
  limit: number
}) => {
  const response = await api.post<ApiResponse<{
    list: Agency[]
    total: number
  }>>(
    "/agencies/search", params
  )
  return response
}
