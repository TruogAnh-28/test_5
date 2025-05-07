"use client"

import React, {
  useState,
  useCallback,
} from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  Clipboard,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"
import {
  toast,
} from "sonner"

import {
  useUrlState,
} from "~/shared/hooks/state/use-url-state"

import {
  getAgencyInfo,
} from "~/features/agency/api/agency"
import {
  AgencyForm,
} from "~/features/agency/components/forms/agency-form"
import {
  AgencyUserTable,
} from "~/features/agency/components/tables/agency-user-table"
import {
  type ReferralStatus,
} from "~/features/agency/types/agency"
import {
  copyToClipboardWithMeta,
} from "~/shared/components/shared/copy-button"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/shared/components/ui/card"
import {
  Input,
} from "~/shared/components/ui/input"

// Component for referral link sharing
function ReferralLinkCard({
  referralLink, t,
}: { referralLink: string
  t: any }) {
  const [
    copied,
    setCopied,
  ] = useState(false)

  const handleCopyReferralLink = useCallback(
    () => {
      if (referralLink) {
        copyToClipboardWithMeta(referralLink)
        toast.success(t("referral.copied"))
        setCopied(true)
        setTimeout(
          () => setCopied(false), 2000
        )
      }
    }, [
      referralLink,
      t,
    ]
  )

  return (
    <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-blue-100">
      <CardHeader>
        <CardTitle className="text-lg">{t("referral.shareTitle")}</CardTitle>

        <CardDescription>{t("referral.shareDescription")}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            value={referralLink}
            readOnly
            className="bg-white flex-1"
          />

          <Button
            onClick={handleCopyReferralLink}
            variant={copied ? "outline" : "default"}
            className={copied ? "bg-green-100 text-green-800 border-green-200" : ""}
          >
            <Clipboard className="mr-2 size-4" />

            {copied ? t("referral.copied") : t("referral.copy")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ViewUserAgency() {
  const t = useTranslations("agency")
  const [
    filters,
    setFilters,
  ] = useUrlState({
    key: "",
    page: 1,
    limit: 10,
    status: undefined as ReferralStatus | undefined,
  })

  const {
    data: agencyInfo, isLoading: isLoadingAgency, error,
  } = useQuery({
    queryKey: ["getAgencyInfo"],
    queryFn: getAgencyInfo,
  })

  const handleFilterClick = () => {
    // Filter handling logic here
  }

  const inviteCode = agencyInfo?.data?.inviteCode
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const referralLink = inviteCode ? `${baseUrl}/en/register?inviteCode=${inviteCode}` : ""

  // Calculate total from invitedUsers array
  const invitedUsers = agencyInfo?.data?.invitedUsers || []
  const total = invitedUsers.length

  if (!isLoadingAgency && !agencyInfo?.data?.id) {
    return (
      <div className="space-y-8">
        <AgencyForm />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold font-[Phudu] capitalize">{t("title")}</h1>

      <ReferralLinkCard
        referralLink={referralLink}
        t={t}
      />

      <AgencyUserTable
        data={invitedUsers}
        total={total}
        filters={filters}
        onFiltersChange={setFilters}
        onFilterClick={handleFilterClick}
        hasFilters={false}
        hasReset
        error={error}
        isLoading={isLoadingAgency}
      />
    </div>
  )
}
