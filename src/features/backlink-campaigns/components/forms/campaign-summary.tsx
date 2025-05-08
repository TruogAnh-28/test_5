import React from "react"

import Image from "next/image"

import {
  BarChart2,
  CircleDollarSign,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  moneyFormat,
} from "~/shared/utils/shared"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card"

interface CampaignSummaryProps {
  totalTraffic: number
  totalCost: number
}

export function CampaignSummary({
  totalTraffic, totalCost,
}: CampaignSummaryProps) {
  const t = useTranslations("trafficSeoCampaigns")

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <BarChart2 className="mr-2 size-5" />

          {t("form.summary.title")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("form.summary.calculatedTraffic")}
                </p>

                <h3 className="text-xl font-bold mt-1">
                  {totalTraffic.toLocaleString()}
                </h3>
              </div>

              <div className="p-3 bg-primary/10 rounded-full">
                <BarChart2 className="size-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("form.summary.calculatedCost")}
                </p>

                <h3 className="text-xl font-bold mt-1">
                  <span className="flex flex-row items-center gap-2">
                    {
                      moneyFormat(
                        totalCost, {
                          suffix: "",
                        }
                      )
                    }

                    <Image
                      src="/images/logo/logo_1.png"
                      alt="Auto Ranker"
                      width={20}
                      height={20}
                    />
                  </span>
                </h3>
              </div>

              <div className="p-3 bg-primary/10 rounded-full">
                <CircleDollarSign className="size-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
