import {
  type CampaignReport,
  type SearchCampaignReport,
  type SearchCampaignParams,
  type SearchCampaignResult,
  type CampaignReportResponse,
  type ReportItemAdminRequest,
  type ReportItemRequest,
  type ReportItemResponse,
} from "~/features/reports/types/report"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const getOneCampaignReport = async (campaignId: number) => {
  const response = await api.post<ApiResponse<CampaignReport>>(
    "/report/campaign-report/campaign",
    {
      campaignId,
    }
  )
  return response
}

export const getOverviewCampaigns = async (data: SearchCampaignReport) => {
  const response = await api.post<ApiResponse<CampaignReportResponse[]>>(
    "/report/campaign-report",
    data
  )
  return response
}
export const searchCampaigns = async (params: SearchCampaignParams) => {
  const response = await api.post<ApiResponse<SearchCampaignResult>>(
    "/campaigns/search",
    params
  )
  return response
}
export const getReportItemAdmin = async (params: ReportItemAdminRequest) => {
  const response = await api.post<ApiResponse<ReportItemResponse[]>>(
    "/report/campaigns-report/all",
    params
  )
  return response
}
export const getReportItem = async (params: ReportItemRequest) => {
  const response = await api.post<ApiResponse<ReportItemResponse[]>>(
    "/report/campaigns-report/user",
    params
  )
  return response
}
