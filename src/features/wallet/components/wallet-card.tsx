"use client"

import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  CreditCard, History,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  moneyFormat,
} from "~/shared/utils/shared"

import {
  getMe,
} from "~/features/user/api/user"
import {
  useWalletBalance,
} from "~/features/wallet/store/use-wallet"
import {
  Link,
} from "~/i18n"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card,
} from "~/shared/components/ui/card"

export function WalletCard() {
  const t = useTranslations("common")
  const { data: userData } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  })

  const {
    data: walletData, isLoading: isWalletLoading,
  } = useWalletBalance(userData?.data?.walletId)

  return (
    <Card className="overflow-hidden shadow-md bg-gradient-to-r from-[#0c9697] to-[#27BDBE] ">
      <div className="p-5 text-white">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium opacity-80">{t("Balance")}</p>

            <h2 className="text-3xl font-bold">
              {
                isWalletLoading ? "..." : moneyFormat(
                  walletData?.balance || 0, {
                    suffix: " credit",
                  }
                )
              }
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
              size="sm"
              asChild
            >
              <Link href="/deposit">
                <CreditCard className="mr-2 size-4" />

                {t("deposit")}
              </Link>
            </Button>

            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
              size="sm"
              asChild
            >
              <Link href="/transactions">
                <History className="mr-2 size-4" />

                {t("transaction")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
