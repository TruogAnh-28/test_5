import {
  useTranslations,
} from "next-intl"
import {
  z,
} from "zod"

type TranslationFunction = (key: string, values?: Record<string, string>) => string

export const createSubmitlinkSchemas = (t: TranslationFunction) => {
  const linkSchema = z.object({
    link: z.string().min(
      1, t("form.links.placeholders.linkSource")
    ).url(t("form.errorMessages.invalidSourceUrl")),
    linkTo: z.string().min(
      1, t("form.links.placeholders.linkTarget")
    ).url(t("form.errorMessages.invalidTargetUrl")),
    distribution: z.string(),
    traffic: z.number().int().min(
      0, t("form.errorMessages.trafficPositive")
    ),
    anchorText: z.string(),
    status: z.string(),
    url: z.string().url(t("form.errorMessages.invalidUrl")),
    page: z.string(),
    id: z.number().optional(),
  })

  const submitlinkCampaignsSchema = z.object({
    name: z.string().min(
      1, t("form.placeholders.name")
    ),
    type: z.string().optional(),
    device: z.string(),
    title: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    totalTraffic: z.number().min(
      0, t("form.errorMessages.totalTrafficPositive")
    ).optional(),
    cost: z.number().min(
      0, t("form.errorMessages.costPositive")
    ).optional(),
    domain: z.string().min(
      1, t("form.placeholders.domain")
    ).regex(
      /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t("form.errorMessages.invalidDomain")
    ),
    search: z.string(),
    status: z.string(),
    links: z.array(linkSchema),
    userId: z.number().optional(),
    countryId: z.number(),
    campaignTypeId: z.number().optional(),
  }).refine(
    (data) => {
      const hasLinks = data.links && data.links.length > 0
      return hasLinks
    },
    {
      message: t("form.errorMessages.requireKeywordOrLink"),
      path: ["root"],
    }
  )

  return {
    linkSchema,
    submitlinkCampaignsSchema,
  }
}

export const useSubmitlinkSchemas = () => {
  const t = useTranslations("submitlink-campaigns")
  return createSubmitlinkSchemas(t)
}

export type SubmitlinkCampaignsInput = z.infer<ReturnType<typeof createSubmitlinkSchemas>["submitlinkCampaignsSchema"]>

export type Link = {
  id?: number
  campaignId?: number
  link: string
  linkTo: string
  distribution: string
  traffic: number
  anchorText: string
  status: string
  url: string
  page: string
  createdAt?: Date
  updatedAt?: Date
}

export enum CampaignStatus {
  NOT_STARTED = "NOT_STARTED",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  CANCEL = "CANCEL",
}

export type SubmitlinkCampaigns = {
  id: number
  userId?: number
  username?: string
  countryId?: number
  campaignTypeId?: number
  name: string
  type: string
  device: string
  title: string
  startDate: Date | string
  endDate: Date | string
  totalTraffic: number
  totalCost: number
  domain: string
  search: string
  status: string
  createdAt?: Date
  updatedAt?: Date
  links?: Link[]
}

export type SubmitlinkCampaignsAdmin = SubmitlinkCampaigns & {
  user_name: string
}

export type SearchSubmitlinkCampaignsResponse = {
  campaigns: SubmitlinkCampaigns[]
  total: number
}

export type SearchSubmitlinkCampaigns = {
  key: string
  limit: number
  page: number
  campaignTypeId: number
  userId?: number
  countryId?: number
  device?: string
  status?: string
  domain?: string
  title?: string
  startDate?: string
  endDate?: string
}

export interface CampaignLink {
  createdAt: string
  updatedAt: string
  id: number
  campaignId: number
  link: string
  linkTo: string
  distribution: string
  traffic: number
  anchorText: string
  status: string
  url: string
  page: string
  isDeleted: boolean
}

export interface CampaignDetailResponse {
  id: number
  userId: number
  countryId: number
  name: string
  device: string
  title: string
  startDate: string
  endDate: string
  totalTraffic: number
  totalCost: number
  domain: string
  search: string
  status: string
  createdAt: string
  updatedAt: string
}
export interface CreateCampaignDetailResponse {
  id: number
  campaignName: string
  campaignDomain: string
  startDate: string
  endDate: string
  targetTraffic: number
  cost: number
  linkCount: number
  keywordCount: number
  links: CampaignLink[]
}

export interface LinkDetailResponse {
  createdAt: string
  updatedAt: string
  id: number
  campaignId: number
  link: string
  linkTo: string
  distribution: string
  traffic: number
  cost: number
  anchorText: string
  status: string
  url: string
  page: string
  isDeleted: boolean
}
