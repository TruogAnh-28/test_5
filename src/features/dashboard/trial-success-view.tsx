"use client"

import React, {
  useEffect,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  CheckCircle, Home, BarChart3,
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
  Card, CardContent,
} from "~/shared/components/ui/card"

export function TrialSuccessView() {
  const t = useTranslations("dashboard")
  const router = useRouter()

  // Auto-redirect after 5 seconds
  useEffect(
    () => {
      const timer = setTimeout(
        () => {
          router.push("/")
        }, 5000
      )

      return () => clearTimeout(timer)
    }, [router]
  )

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="overflow-hidden shadow-lg border-0">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-white">
            <div className="flex flex-col items-center text-center space-y-4 py-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <CheckCircle className="size-12 text-white" />
              </div>

              <h2 className="text-2xl font-bold">
                {
                  t("trial.successTitle")
                }
              </h2>

              <p className="text-white/90">
                {
                  t("trial.successDescription")
                }
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 w-full">
                <div className="text-center">
                  <span className="text-3xl font-bold">1000</span>

                  <span className="text-sm ml-1">
                    {
                      t("trial.credits")
                    }
                  </span>
                </div>
              </div>

              <p className="text-sm text-white/80">
                {
                  t("trial.autoRedirect")
                }
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  asChild
                  variant="secondary"
                  className="bg-white hover:bg-white/90 text-emerald-700"
                >
                  <Link href="/">
                    <Home className="mr-2 size-4" />

                    {
                      t("trial.backToDashboard")
                    }
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/40"
                >
                  <Link href="/reports">
                    <BarChart3 className="mr-2 size-4" />

                    {
                      t("trial.viewReports")
                    }
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
