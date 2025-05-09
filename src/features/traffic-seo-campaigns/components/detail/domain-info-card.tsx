import React from "react"

import Image from "next/image"

import {
  Globe, Webhook, ExternalLink,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  moneyFormat,
} from "~/shared/utils/shared"

import {
  Card, CardContent, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

interface DomainInfoCardProps {
  domain: string
  title: string
  cost: number
}

export const DomainInfoCard: React.FC<DomainInfoCardProps> = ({
  domain, cost, title,
}) => {
  const t = useTranslations("trafficSeoCampaigns")

  return (
    <Card className="border-neutral-200 dark:border-neutral-800">
      <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <CardTitle className="flex items-center text-lg">
          <Globe className="mr-2 size-5 text-foreground" />

          {t("detail.domainInfo")}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{t("form.domain")}</h3>

            <div className="flex items-center gap-2 mt-1 overflow-hidden">
              <Globe className="size-4 text-foreground shrink-0" />

              <a
                href={`https://${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 overflow-hidden text-ellipsis"
              >
                <span className="overflow-hidden text-ellipsis">{domain}</span>

                <ExternalLink className="size-3 shrink-0" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{t("form.title")}</h3>

            <div className="flex items-center gap-2 mt-1">
              <Webhook className="size-4 text-muted-foreground" />

              <span>{title}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{t("form.cost")}</h3>

            <div className="flex items-center gap-2 mt-1">
              <span>
                <span className="font-medium text-sm flex flex-row items-center gap-2">
                  {
                    moneyFormat(
                      cost, {
                        suffix: "",
                      }
                    )
                  }

                  <Image
                    src="/images/logo/logo_1.png"
                    alt="Auto Ranker"
                    width={15}
                    height={15}
                  />
                </span>

              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
