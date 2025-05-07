"use client"

import React from "react"

import {
  AlertCircle, RefreshCw,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"
import {
  toast,
} from "sonner"

import {
  Link,
} from "~/i18n"
import {
  api,
} from "~/lib/modules/api"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from "~/shared/components/ui/card"
import {
  type ApiResponse,
} from "~/types/api"

interface EmailVerificationFailedProps {
  tokenFromReq: string
}

export function EmailVerificationFailed({ tokenFromReq }: EmailVerificationFailedProps) {
  const t = useTranslations("verify")
  const [
    isResending,
    setIsResending,
  ] = React.useState(false)

  const handleResendVerification = async () => {
    if (!tokenFromReq) {
      toast.error(t("failed.noEmailProvided"))
      return
    }

    setIsResending(true)

    try {
      const response = await api.post<ApiResponse<null>>(
        "/auth/resend-otp", {
          tokenFromReq,
        }
      )

      if (response.status) {
        toast.success(response.message || t("failed.resendSuccess"))
      }
      else {
        toast.error(response.message || t("failed.resendError"))
      }
    }
    catch {
      toast.error(t("failed.resendError"))
    }
    finally {
      setIsResending(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-destructive/30">
        <CardHeader className="bg-destructive/10 border-b border-destructive/20">
          <CardTitle className="text-center flex items-center justify-center">
            <AlertCircle className="size-6 text-destructive mr-2" />

            <span className="text-destructive">{t("failed.title")}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex justify-center mb-6">
            <div className="size-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="size-10 text-destructive" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">{t("failed.verificationFailed")}</h2>

            <p className="text-muted-foreground mb-4">{t("failed.tokenInvalid")}</p>
          </div>

          <div className="space-y-3 mx-auto max-w-md">
            <div className="p-3 bg-muted rounded-md">
              <h3 className="font-medium mb-1">{t("failed.whatToDo")}</h3>

              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>{t("failed.tryAgain")}</li>

                <li>{t("failed.checkEmail")}</li>

                <li>{t("failed.contactSupport")}</li>
              </ul>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={handleResendVerification}
            disabled={isResending}
          >
            {
              isResending ? (
                <React.Fragment>
                  <RefreshCw className="mr-2 size-4 animate-spin" />

                  {t("failed.resending")}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <RefreshCw className="mr-2 size-4" />

                  {t("failed.resendVerification")}
                </React.Fragment>
              )
            }
          </Button>

          <Button asChild>
            <Link href="/login">
              {t("failed.backToLogin")}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
