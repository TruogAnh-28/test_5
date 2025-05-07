"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  ArrowLeft, Calendar, Clock, CreditCard, Globe, LayoutGrid, Receipt, Tag, User,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  getTransactionById,
} from "~/features/transaction/api/transaction"
import {
  TransactionStatus,
  TransactionType,
} from "~/features/transaction/type/transaction"
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
  Separator,
} from "~/shared/components/ui/separator"
import {
  Skeleton,
} from "~/shared/components/ui/skeleton"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "~/shared/components/ui/tabs"

export function TransactionDetail({ id }: { id: number }) {
  const t = useTranslations("transaction")
  const tCommon = useTranslations("common")

  const {
    data, isLoading, error,
  } = useQuery({
    queryKey: [
      "getTransaction",
      id,
    ],
    queryFn: () => getTransactionById(id),
    enabled: !!id,
  })

  const transaction = data?.data

  const getStatusBadge = (status?: string) => {
    if (!status) return null

    if (status === TransactionStatus.PENDING)
      return (
        <Badge
          variant="outline"
          className="bg-warning/20 text-warning"
        >
          {t("status.pending")}
        </Badge>
      )

    if (status === TransactionStatus.COMPLETED)
      return (
        <Badge
          variant="outline"
          className="bg-success/20 text-success"
        >
          {t("status.completed")}
        </Badge>
      )

    if (status === TransactionStatus.FAILED)
      return (
        <Badge
          variant="outline"
          className="bg-destructive/20 text-destructive"
        >
          {t("status.failed")}
        </Badge>
      )

    return <Badge variant="outline">{status}</Badge>
  }

  const getTypeBadge = (type?: string) => {
    if (!type) return null

    if (type === TransactionType.PAY_SERVICE)
      return (
        <Badge
          variant="outline"
          className="bg-accent/20 text-accent"
        >
          {t("type.payService")}
        </Badge>
      )

    if (type === TransactionType.DEPOSIT)
      return (
        <Badge
          variant="outline"
          className="bg-success/20 text-success"
        >
          {t("type.deposit")}
        </Badge>
      )

    return <Badge variant="outline">{type}</Badge>
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-destructive mb-4">{error instanceof Error ? error.message : tCommon("error")}</p>

            <Button asChild>
              <Link href="/transactions">
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <h1 className="text-xl font-semibold">{t("detail.title")}</h1>
      </div>

      {
        isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {
                  Array(6).fill(0).map(_ => (
                    <div
                      key={_}
                      className="flex items-center gap-4"
                    >
                      <Skeleton className="size-10 rounded-full" />

                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[120px]" />

                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        ) : transaction ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center">
                  <span>{t("detail.information")}</span>

                  <div className="flex items-center gap-2">
                    {getTypeBadge(transaction.type)}

                    {getStatusBadge(transaction.status)}
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Receipt className="size-6 text-primary" />
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">{t("detail.transactionId")}</p>

                      <p className="font-medium">
                        #
                        {transaction.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <CreditCard className="size-6 text-primary" />
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">{t("detail.amount")}</p>

                      <p className="font-medium text-lg">
                        {transaction.amount?.toLocaleString()}

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
                      <p className="text-sm text-muted-foreground">{t("detail.walletId")}</p>

                      <p className="font-medium">
                        {transaction.walletId}

                        {
                          transaction.username ? (
                            <span className="text-sm text-muted-foreground ml-2">
                              (
                              {transaction.username}
                              )
                            </span>
                          ) : null
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="size-6 text-primary" />
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">{t("detail.createdAt")}</p>

                      <p className="font-medium">
                        {
                          new Date(transaction.createdAt).toLocaleDateString(
                            "vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {
              transaction.type === TransactionType.PAY_SERVICE && transaction.campaign ? (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>{t("detail.campaignDetails")}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-accent/10 p-2 rounded-full">
                          <LayoutGrid className="size-6 text-accent" />
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">{t("detail.campaignName")}</p>

                          <p className="font-medium">{transaction.campaign.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="bg-accent/10 p-2 rounded-full">
                          <Globe className="size-6 text-accent" />
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">{t("detail.domain")}</p>

                          <p className="font-medium">{transaction.campaign.domain}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="bg-accent/10 p-2 rounded-full">
                          <Tag className="size-6 text-accent" />
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">{t("detail.trafficAndCost")}</p>

                          <p className="font-medium">
                            {transaction.campaign.totalTraffic.toLocaleString()}

                            {t("detail.visits")}

                            {" "}

                            |
                            {transaction.campaign.totalCost.toLocaleString()}

                            {" "}
                            ₫
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="bg-accent/10 p-2 rounded-full">
                          <Clock className="size-6 text-accent" />
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">{t("detail.campaignPeriod")}</p>

                          <p className="font-medium">
                            {new Date(transaction.campaign.startDate).toLocaleDateString("vi-VN")}

                            {" "}

                            -
                            {new Date(transaction.campaign.endDate).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <Tabs
                        defaultValue="keywords"
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-2 mb-4">
                          <TabsTrigger value="keywords">{t("detail.keywords")}</TabsTrigger>

                          <TabsTrigger value="links">{t("detail.links")}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="keywords">
                          <div className="rounded-md border">
                            <div className="grid grid-cols-3 p-3 bg-muted/50 text-sm font-medium border-b">
                              <div>{t("detail.keyword")}</div>

                              <div>{t("detail.traffic")}</div>

                              <div>{t("detail.cost")}</div>
                            </div>

                            <div className="divide-y">
                              {
                                transaction.campaign.keywords && transaction.campaign.keywords.length > 0 ? (
                                  transaction.campaign.keywords.map(keyword => (
                                    <div
                                      key={keyword.name}
                                      className="grid grid-cols-3 p-3 text-sm"
                                    >
                                      <div className="truncate">{keyword.name}</div>

                                      <div>{keyword.traffic}</div>

                                      <div>
                                        {Number(keyword.cost).toLocaleString()}

                                        {" "}
                                        ₫
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-muted-foreground">
                                    {t("detail.noKeywords")}
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="links">
                          <div className="rounded-md border">
                            <div className="grid grid-cols-3 p-3 bg-muted/50 text-sm font-medium border-b">
                              <div>{t("detail.source")}</div>

                              <div>{t("detail.target")}</div>

                              <div>{t("detail.traffic")}</div>
                            </div>

                            <div className="divide-y">
                              {
                                transaction.campaign.links && transaction.campaign.links.length > 0 ? (
                                  transaction.campaign.links.map(link => (
                                    <div
                                      key={link.source}
                                      className="grid grid-cols-3 p-3 text-sm"
                                    >
                                      <div className="truncate">{link.source}</div>

                                      <div className="truncate">{link.target}</div>

                                      <div>{link.traffic}</div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-muted-foreground">
                                    {t("detail.noLinks")}
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              ) : null
            }
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p>{t("detail.notFound")}</p>

              <Button
                asChild
                className="mt-4"
              >
                <Link href="/transactions">
                  <ArrowLeft className="mr-2 size-4" />

                  {tCommon("back")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )
      }
    </div>
  )
}
