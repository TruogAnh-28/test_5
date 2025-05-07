"use client"

import React from "react"

import {
  CheckCircle2,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  Link,
} from "~/i18n"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

export function EmailVerificationSuccess() {
  const t = useTranslations("verify")

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-success/30">
        <CardHeader className="bg-success/10 border-b border-success/20">
          <CardTitle className="text-center flex items-center justify-center">
            <CheckCircle2 className="size-6 text-success mr-2" />

            <span className="text-success">{t("success.title")}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex justify-center mb-6">
            <div className="size-20 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="size-10 text-success" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">{t("success.verificationComplete")}</h2>

            <p className="text-muted-foreground">{t("success.accountVerified")}</p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/login">
              {t("success.continueToLogin")}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
