import React from "react"

import {
  Link as LinkIcon, ExternalLink,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  type CampaignLink,
} from "~/features/submitlink-campaigns/type/submitlink-campaigns"
import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

interface LinksListProps {
  links: CampaignLink[]
}

export const LinksList: React.FC<LinksListProps> = ({ links }) => {
  const t = useTranslations("submitlinkCampaigns")

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

            {" "}

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
                    {/* Link Header - Showing only the link field */}
                    <div className={`p-4 ${index % 2 === 0 ? "bg-neutral-50 dark:bg-neutral-900" : "bg-neutral-100 dark:bg-neutral-800"}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-foreground shrink-0">
                            <LinkIcon className="size-5" />
                          </div>

                          <div className="min-w-0">
                            <a
                              href={link.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 text-lg font-medium mt-1 overflow-hidden text-ellipsis"
                            >
                              <span className="overflow-hidden text-ellipsis">{link.link}</span>

                              <ExternalLink className="size-4 shrink-0" />
                            </a>
                          </div>
                        </div>
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
