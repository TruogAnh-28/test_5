"use client"

import {
  useEffect, useState,
} from "react"

import {
  useTranslations,
} from "next-intl"
import {
  toast,
} from "sonner"

import {
  EmailVerificationFailed,
} from "~/features/auth/components/email-verification-failed"
import {
  EmailVerificationSuccess,
} from "~/features/auth/components/email-verification-success"
import {
  api,
} from "~/lib/modules/api"
import {
  Loading,
} from "~/shared/components/shared/loading"
import {
  type ApiResponse,
} from "~/types/api"

interface VerifyEmailPageProps {
  params: {
    token: string
  }
}

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const t = useTranslations("verify")
  const [
    verificationState,
    setVerificationState,
  ] = useState<"loading" | "success" | "failed">("loading")

  useEffect(
    () => {
      const verifyEmail = async () => {
        try {
        // Attempt to verify the token with the provided token
          const response = await api.post<ApiResponse<{ token: string }>>(
            "/auth/confirm", {
              token: params.token,
            }
          )
          if (response.status === true) {
            setVerificationState("success")
            toast.success(response.message || t("success.verificationComplete"))
          }
          if (response.status === false) {
            setVerificationState("failed")
            toast.error(response.message || t("failed.verificationFailed"))
          }
        }
        catch {
        // Handle any errors during verification
          setVerificationState("failed")
          toast.error(t("failed.verificationFailed"))
        }
      }

      if (params.token) {
        verifyEmail()
      }
      else {
        setVerificationState("failed")
        toast.error(t("failed.noToken"))
      }
    }, [
      params.token,
      t,
    ]
  )

  // Show appropriate component based on verification state
  return (
    <div className="h-svh bg-background container mx-auto p-4 flex items-center justify-center">
      {verificationState === "loading" && <Loading />}

      {verificationState === "success" && <EmailVerificationSuccess />}

      {verificationState === "failed" && <EmailVerificationFailed tokenFromReq={params.token} />}
    </div>
  )
}
