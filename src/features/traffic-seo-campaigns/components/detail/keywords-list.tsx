import React from "react"

import {
  Tag, Signal, MousePointer, ExternalLink, TrendingUp, History, Clock,
  Activity, Smartphone, Laptop, Tablet, AlertCircle,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  type getKeywordbyCampaignIdResponse, type LogDetailKeyword,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  showDialog,
} from "~/shared/components/dialogs/use-open-dialog"
import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

interface KeywordsListProps {
  keywords: getKeywordbyCampaignIdResponse[]
}

export const KeywordsList: React.FC<KeywordsListProps> = ({ keywords }) => {
  const t = useTranslations("trafficSeoCampaigns")

  // Function to render a device icon based on device type
  const renderDeviceIcon = (device: string) => {
    const deviceLower = device.toLowerCase()
    if (deviceLower.includes("mobile")) {
      return <Smartphone className="size-3 text-primary" />
    }
    if (deviceLower.includes("desktop")) {
      return <Laptop className="size-3 text-primary" />
    }
    if (deviceLower.includes("tablet")) {
      return <Tablet className="size-3 text-primary" />
    }
    return <AlertCircle className="size-3 text-primary" />
  }

  // Handler to view detailed logs in a timeline
  const handleViewLogs = (
    keywordId: number, keywordName: string
  ) => {
    // Just pass the necessary data to the dialog
    showDialog(
      "keyword-logs", {
        keywordId,
        keywordName,
      }
    )
  }

  return (
    <Card className="border-neutral-200 dark:border-neutral-800">
      <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Tag className="mr-2 size-5 text-foreground" />

            {t("form.keywords.title")}
          </CardTitle>

          <Badge variant="outline">
            {keywords.length}

            {t("detail.totalKeywords")}
          </Badge>
        </div>

        <CardDescription>
          {t("detail.keywordsDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {
          keywords.length === 0 ? (
            <div className="text-center py-12 px-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
              <Tag className="size-10 mx-auto text-muted-foreground mb-3" />

              <p className="text-muted-foreground">{t("form.keywords.empty")}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {
                keywords.map((
                  keyword, index
                ) => (
                  <div
                    key={keyword.id}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden"
                  >
                    {/* Keyword Header */}
                    <div className={`p-4 ${index % 2 === 0 ? "bg-neutral-50 dark:bg-neutral-900" : "bg-neutral-100 dark:bg-neutral-800"}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-foreground shrink-0">
                            <Tag className="size-5" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-medium text-lg overflow-hidden text-ellipsis">{keyword.name}</h3>

                            <p className="text-sm text-muted-foreground flex items-center mt-1">
                              <Signal className="size-3 mr-1 shrink-0" />

                              {t("form.keywords.distribution")}

                              :
                              {keyword.distribution}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                          <Badge
                            variant="outline"
                            className="whitespace-nowrap"
                          >
                            <TrendingUp className="size-3 mr-1.5 shrink-0" />

                            {t("form.keywords.traffic")}

                            :
                            {keyword.trafficCompleted}

                            /
                            {keyword.traffic}
                          </Badge>

                          <Button
                            size="sm"
                            variant="outline"
                            className="whitespace-nowrap"
                            onClick={
                              () => handleViewLogs(
                                keyword.id, keyword.name
                              )
                            }
                          >
                            <History className="size-4 mr-1" />

                            {
                              t(
                                "detail.viewLogs", {
                                  defaultValue: "View Logs",
                                }
                              )
                            }
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Keyword URLs */}
                    {
                      keyword.urls && keyword.urls.length > 0 ? (
                        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                          <h4 className="text-sm font-medium mb-3 flex items-center">
                            <MousePointer className="size-3.5 mr-1.5 text-muted-foreground shrink-0" />

                            {t("form.keywords.urls")}
                          </h4>

                          <div className="space-y-2 pl-2">
                            {
                              keyword.urls.map((url: string) => (
                                <div
                                  key={url}
                                  className="flex items-center gap-2 text-sm group"
                                >
                                  <div className="size-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 group-hover:bg-primary shrink-0" />

                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-1 break-all"
                                  >
                                    <span className="break-all line-clamp-1">{url}</span>

                                    <ExternalLink className="size-3 shrink-0 opacity-70 group-hover:opacity-100" />
                                  </a>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      ) : null
                    }

                    {/* Recent Logs - show up to 3 most recent logs */}
                    {
                      keyword.logs && keyword.logs.length > 0 ? (
                        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                          <h4 className="text-sm font-medium mb-3 flex items-center">
                            <Clock className="size-3.5 mr-1.5 text-muted-foreground shrink-0" />

                            {
                              t(
                                "detail.recentLogs", {
                                  defaultValue: "Recent Activities",
                                }
                              )
                            }
                          </h4>

                          <div className="space-y-2">
                            {
                              keyword.logs.slice(
                                0, 3
                              ).map((log: LogDetailKeyword) => (
                                <div
                                  key={log.keywordId}
                                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-md"
                                >
                                  <div className="flex items-center gap-2">
                                    <Activity className="size-4 text-primary" />

                                    <span className="text-sm">{log.statusName}</span>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                      {renderDeviceIcon(log.device)}

                                      <span className="text-xs text-muted-foreground">{log.device}</span>
                                    </div>

                                    <span className="text-xs text-muted-foreground">
                                      {
                                        new Date(log.timestamp).toLocaleString(
                                          "vi-VN", {
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }
                                        )
                                      }
                                    </span>
                                  </div>
                                </div>
                              ))
                            }

                            {
                              keyword.logs.length > 3 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full text-primary"
                                  onClick={
                                    () => handleViewLogs(
                                      keyword.id, keyword.name
                                    )
                                  }
                                >
                                  {
                                    t(
                                      "detail.viewAllLogs", {
                                        defaultValue: "View all logs",
                                      }
                                    )
                                  }
                                </Button>
                              )
                            }
                          </div>
                        </div>
                      ) : null
                    }
                  </div>
                ))
              }
            </div>
          )
        }
      </CardContent>
    </Card>
  )
}
