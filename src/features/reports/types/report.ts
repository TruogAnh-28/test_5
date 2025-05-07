/**
import { ReportItemRequest } from './report';
import { user } from '~/locales/vi/user.json';
 * Dữ liệu thống kê chiến dịch theo thời gian
 */
export interface CampaignStat {
  date: string
  value: number
}

/**
 * Thông tin dữ liệu keyword
 */
export interface KeywordData {
  id: number
  keyword: string
  rank: number
  change: number
  traffic: number
}

/**
 * Thông tin dữ liệu domain
 */
export interface DomainData {
  id: number
  domain: string
  quality: string
  count: number
}

/**
 * Thông tin phân bổ thiết bị
 */
export interface DeviceDistribution {
  name: string
  value: number
}

/**
 * Campaign Data
 */
export interface Campaign {
  id: number
  userId: number
  countryId: number
  name: string
  campaignTypeId: number
  device: string
  title: string
  startDate: string
  endDate: string
  totalTraffic: number
  cost: string
  domain: string
  search: string
  status: string
  createdAt: string
  updatedAt: string
}

/**
 * Thông tin liên kết của chiến dịch
 */
export interface LinkAttributes {
  id?: number
  campaignId: number
  link: string
  linkTo: string
  distribution: string
  traffic: number
  anchorText: string
  status: string
  url: string
  page: string
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

/**
 * Thông tin từ khóa của chiến dịch
 */
export interface KeywordAttributes {
  id?: number
  campaignId: number
  name: string
  urls?: string[]
  distribution: string
  traffic: number
  cost: number
  trafficCompleted: number
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

/**
 * Báo cáo chiến dịch
 */
export interface CampaignReport {
  campaignId: number
  campaignName: string
  campaignDomain: string
  startDate: string
  endDate: string
  totalTraffic: number
  linkCount: number
  keywordCount: number
  links: LinkAttributes[]
  keywords: KeywordAttributes[]
}

/**
 * Phản hồi báo cáo chiến dịch
 */
export interface CampaignReportResponse {
  campaignTypeId: number
  campaignTypeName: string
  count: number
}

/**
 * Tham số tìm kiếm báo cáo chiến dịch
 */
export interface SearchCampaignReport {
  status: string
  start_date: string
  end_date: string
}

/**
 * Tham số tìm kiếm chiến dịch
 */
export interface SearchCampaignParams {
  userId?: number
  countryId?: number
  campaignTypeId?: string | number
  device?: string
  title?: string
  startDate?: string
  endDate?: string
  status?: string
  page: number
  limit: number
}

export interface SearchCampaignResult {
  campaigns: Campaign[]
  total: number
}

export interface ReportItemAdminRequest {
  start_date: string
  end_date: string
}
export interface ReportItemRequest extends ReportItemAdminRequest {
  userId?: number
}
export interface TrafficDaily {
  date: string
  traffic: number
}
export interface ReportItemResponse {
  campaignId: number
  campaignName: string
  linkCount: number
  keywordCount: number
  activeLink: number
  activeKeyword: number
  traffic: TrafficDaily[]
}
