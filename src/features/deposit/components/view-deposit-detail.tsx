"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  ArrowLeft, Calendar, Clock, CreditCard, Receipt, User,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  getDeposit,
} from "~/features/deposit/api/deposit"
import {
  DepositStatus,
} from "~/features/deposit/type/deposit"
import {
  Link,
} from "~/i18n"
import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "~/shared/components/ui/card"
import {
  Skeleton,
} from "~/shared/components/ui/skeleton"

export function ViewDepositDetail({ id }: { id: number }) {
  const t = useTranslations("deposit")
  const tCommon = useTranslations("common")

  const {
    data, isLoading, error,
  } = useQuery({
    queryKey: [
      "getDeposit",
      id,
    ],
    queryFn: () => getDeposit({
      id,
    }),
    enabled: !!id,
  })

  const deposit = data?.data

  const getStatusBadge = (status?: DepositStatus) => {
    if (!status) return null

    if (status === DepositStatus.PENDING)
      return (
        <Badge
          variant="outline"
          className="bg-warning/20 text-warning"
        >
          {t("status.pending")}
        </Badge>
      )

    if (status === DepositStatus.COMPLETED)
      return (
        <Badge
          variant="outline"
          className="bg-success/20 text-success"
        >
          {t("status.approved")}
        </Badge>
      )

    if (status === DepositStatus.FAILED)
      return (
        <Badge
          variant="outline"
          className="bg-destructive/20 text-destructive"
        >
          {t("status.rejected")}
        </Badge>
      )

    return <Badge variant="outline">{t("status.unknown")}</Badge>
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-destructive mb-4">{error instanceof Error ? error.message : tCommon("error")}</p>

            <Button asChild>
              <Link href="/deposit-history">
                <ArrowLeft className="mr-2 size-4" />

                {tCommon("back")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center">
        <Button
          asChild
          variant="ghost"
          className="p-0 mr-4"
        >
          <Link href="/deposit-history">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>

        <h1 className="text-2xl font-semibold">{t("detail.title")}</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-center">
            <span>{t("detail.information")}</span>

            {
              isLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                getStatusBadge(deposit?.status)
              )
            }
          </CardTitle>
        </CardHeader>

        <CardContent>
          {
            isLoading ? (
              <div className="space-y-4">
                {/* {
                  Array(6).fill(0).map(id => (
                    <div
                      key={`${id}`}
                      className="flex items-center gap-4"
                    >
                      <Skeleton className="size-10 rounded-full" />

                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[120px]" />

                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))
                } */}
              </div>
            ) : deposit ? (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Receipt className="size-6 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">{t("detail.transactionId")}</p>

                    <p className="font-medium">{deposit.orderId}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CreditCard className="size-6 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">{t("detail.amount")}</p>

                    <p className="font-medium text-lg">
                      {deposit.amount.toLocaleString()}

                      {" "}
                      ₫
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="size-6 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">{t("detail.paymentMethod")}</p>

                    <p className="font-medium">{deposit.paymentMethods.name}</p>
                  </div>
                </div>

                {/* {
                  deposit.voucherCode ? (
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Receipt className="size-6 text-primary" />
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">{t("detail.voucherCode")}</p>

                        <p className="font-medium">{deposit.voucherCode}</p>
                      </div>
                    </div>
                  ) : null
                } */}

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="size-6 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">{t("detail.createdAt")}</p>

                    <p className="font-medium">{new Date(deposit.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="size-6 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">{t("detail.processedAt")}</p>

                    <p className="font-medium">
                      {
                        deposit.status !== DepositStatus.PENDING
                          ? new Date(deposit.updatedAt).toLocaleDateString(
                            "vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                          : t("detail.pending")
                      }
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-8">
                <p>{t("detail.notFound")}</p>
              </div>
            )
          }
        </CardContent>
      </Card>

      {
        deposit?.status === DepositStatus.PENDING && (
          <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <h3 className="font-semibold text-warning mb-2">
              {t("detail.pendingNote")}
            </h3>

            <p className="text-sm">{t("detail.pendingDescription")}</p>
          </div>
        )
      }

      {
        deposit?.status === DepositStatus.COMPLETED && (
          <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
            <h3 className="font-semibold text-success mb-2">
              {t("detail.approvedNote")}
            </h3>

            <p className="text-sm">{t("detail.balanceUpdated")}</p>
          </div>
        )
      }
    </div>
  )
}
