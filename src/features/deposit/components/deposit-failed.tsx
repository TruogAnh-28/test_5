"use client"

import React from "react"

import {
  AlertCircle, ArrowLeft, HomeIcon,
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

export function DepositFailed() {
  const t = useTranslations("deposit")
  const tCommon = useTranslations("common")

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-destructive/50">
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
            <h2 className="text-xl font-semibold mb-2">{t("failed.paymentFailed")}</h2>

            <p className="text-muted-foreground mb-4">{t("failed.defaultError")}</p>
          </div>

          <div className="space-y-3 mx-auto max-w-md">
            <div className="p-3 bg-muted rounded-md">
              <h3 className="font-medium mb-1">{t("failed.whatHappened")}</h3>

              <p className="text-sm text-muted-foreground">{t("failed.whatHappenedDesc")}</p>
            </div>

            <div className="p-3 bg-muted rounded-md">
              <h3 className="font-medium mb-1">{t("failed.whatToDo")}</h3>

              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>{t("failed.checkPaymentMethod")}</li>

                <li>{t("failed.tryAgainLater")}</li>

                <li>{t("failed.contactSupport")}</li>
              </ul>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            variant="outline"
          >
            <Link href="/deposit-history">
              <ArrowLeft className="mr-2 size-4" />

              {t("failed.viewHistory")}
            </Link>
          </Button>

          <Button asChild>
            <Link href="/deposit">
              {t("failed.tryAgain")}
            </Link>
          </Button>

          <Button
            asChild
            variant="secondary"
          >
            <Link href="/">
              <HomeIcon className="mr-2 size-4" />

              {tCommon("backToHome")}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
