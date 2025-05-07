import React from "react"

import {
  Link as LinkIcon, ExternalLink, Layers, Signal, Globe, MousePointer, TrendingUp,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  type CampaignLink,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"
import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/shared/components/ui/card"
import {
  Separator,
} from "~/shared/components/ui/separator"

interface LinksListProps {
  links: CampaignLink[]
}

export const LinksList: React.FC<LinksListProps> = ({ links }) => {
  const t = useTranslations("trafficSeoCampaigns")

  return (
    <Card className="border-neutral-200 dark:border-neutral-800">
      <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <LinkIcon className="mr-2 size-5 text-foreground" />

            {t("form.links.title")}
          </CardTitle>

          <Badge variant="outline">
            {links.length}

            {t("detail.totalLinks")}
          </Badge>
        </div>

        <CardDescription>
          {t("detail.linksDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {
          links.length === 0 ? (
            <div className="text-center py-12 px-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
              <LinkIcon className="size-10 mx-auto text-muted-foreground mb-3" />

              <p className="text-muted-foreground">{t("form.links.empty")}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {
                links.map((
                  link, index
                ) => (
                  <div
                    key={link.id}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden"
                  >
                    {/* Link Header */}
                    <div className={`p-4 ${index % 2 === 0 ? "bg-neutral-50 dark:bg-neutral-900" : "bg-neutral-100 dark:bg-neutral-800"}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-foreground shrink-0">
                            <LinkIcon className="size-5" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center flex-wrap gap-2">
                              <h3 className="font-medium text-lg overflow-hidden text-ellipsis">{link.linkTo}</h3>

                              <Badge
                                variant={link.status === "ACTIVE" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {link.status}
                              </Badge>
                            </div>

                            <a
                              href={link.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 text-sm mt-1 overflow-hidden text-ellipsis"
                            >
                              <span className="overflow-hidden text-ellipsis">{link.link}</span>

                              <ExternalLink className="size-3 shrink-0" />
                            </a>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className="self-start md:self-center whitespace-nowrap"
                        >
                          <TrendingUp className="size-3 mr-1.5 shrink-0" />

                          {t("form.links.traffic")}

                          :
                          {link.traffic.toLocaleString()}
                        </Badge>
                      </div>
                    </div>

                    <Separator className="bg-neutral-200 dark:bg-neutral-800" />

                    {/* Link Details */}
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                            <Layers className="size-3.5 mr-1.5 shrink-0" />

                            {t("form.links.anchorText")}
                          </h4>

                          <p className="mt-1 pl-5 break-words">{link.anchorText || "-"}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                            <Signal className="size-3.5 mr-1.5 shrink-0" />

                            {t("form.links.distribution")}
                          </h4>

                          <p className="mt-1 pl-5">{link.distribution || "-"}</p>
                        </div>

                        {/* URL */}
                        {
                          link.url ? (
                            <div className="md:col-span-2">
                              <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                                <Globe className="size-3.5 mr-1.5 shrink-0" />

                                {t("form.links.url")}
                              </h4>

                              <div className="mt-1 pl-5 overflow-hidden">
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1 break-all"
                                >
                                  <span className="break-all line-clamp-1">{link.url}</span>

                                  <ExternalLink className="size-3 shrink-0" />
                                </a>
                              </div>
                            </div>
                          ) : null
                        }

                        {/* Page */}
                        {
                          link.page ? (
                            <div className="md:col-span-2">
                              <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                                <MousePointer className="size-3.5 mr-1.5 shrink-0" />

                                {t("form.links.page")}
                              </h4>

                              <p className="mt-1 pl-5 break-words">{link.page}</p>
                            </div>
                          ) : null
                        }
                      </div>
                    </div>
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
