import React from "react"

import {
  Tag, Signal, MousePointer, ExternalLink, TrendingUp,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  type getKeywordbyCampaignIdResponse,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

interface KeywordsListProps {
  keywords: getKeywordbyCampaignIdResponse[]
}

export const KeywordsList: React.FC<KeywordsListProps> = ({ keywords }) => {
  const t = useTranslations("trafficSeoCampaigns")

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

            {" "}

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
                            {" "}

                            {/* Add min-width to allow text truncation */}
                            <h3 className="font-medium text-lg overflow-hidden text-ellipsis">{keyword.name}</h3>

                            <p className="text-sm text-muted-foreground flex items-center mt-1">
                              <Signal className="size-3 mr-1 shrink-0" />

                              {t("form.keywords.distribution")}
                              :

                              {" "}

                              {keyword.distribution}
                            </p>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className="self-start md:self-center whitespace-nowrap"
                        >
                          <TrendingUp className="size-3 mr-1.5 shrink-0" />

                          {t("form.keywords.traffic")}

                          :

                          {" "}

                          {keyword.trafficCompleted}

                          /

                          {keyword.traffic}
                        </Badge>
                      </div>
                    </div>

                    {/* Keyword URLs */}
                    {
                      keyword.url && keyword.url.length > 0 ? (
                        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                          <h4 className="text-sm font-medium mb-3 flex items-center">
                            <MousePointer className="size-3.5 mr-1.5 text-muted-foreground shrink-0" />

                            {t("form.keywords.urls")}
                          </h4>

                          <div className="space-y-2 pl-2">
                            {
                              keyword.url.map((url: string) => (
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
