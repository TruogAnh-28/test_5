import {
  useTranslations,
} from "next-intl"
import {
  z,
} from "zod"

type TranslationFunction = (key: string, values?: Record<string, string>) => string
export const createAgencySchemas = (t: TranslationFunction) => {
  const agencySchema = z.object({
    bankAccount: z.string()
      .min(
        1, t("form.validation.bankAccountRequired")
      ),
    bankName: z.string()
      .min(
        1, t("form.validation.bankNameRequired")
      ),
    accountHolder: z.string()
      .min(
        1, t("form.validation.accountHolderRequired")
      ),
  })

  return agencySchema
}
export const useAgencySchemas = () => {
  const t = useTranslations("agency")
  return createAgencySchemas(t)
}
export type AgencyInput = z.infer<ReturnType<typeof createAgencySchemas>>
// export interface Agency {
//   id: number
//   user_id: number
//   inviteCode string
//   phone: string
//   bank_name: string
//   bank_account: string
//   account_holder: string
//   status: AgencyStatus
//   created_at: string
//   updated_at: string
// }

export enum AgencyStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  REJECTED = "REJECTED",
}

export enum ReferralStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface AgencyStats {
  total_referrals: number
  active_referrals: number
  total_earnings: number
  conversion_rate: number
  recent_referrals: AgencyReferral[]
}
export interface AgencyReferral {
  id: number
  agency_id: number
  user_id: number
  status: ReferralStatus
  created_at: string
  updated_at: string
  commission: number
  user: {
    id: number
    name: string
    email: string
  }
}
export interface Agency {
  id: number
  userId: number
  inviteCode: string
  bankName: string
  bankAccount: string
  accountHolder: string
  status: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
export interface InvitedUsers {
  id: number
  email: string
  userName: string
  commission: number
  createdAt: string
}
export interface AgencyGetMe extends Agency {
  invitedUsers: InvitedUsers[]
}
