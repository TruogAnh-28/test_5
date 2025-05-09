"use client"

import React, {
  useState,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  useQuery, useMutation, useQueryClient,
} from "@tanstack/react-query"
import {
  Sparkles, Gift, ArrowRight,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"
import {
  toast,
} from "sonner"

import {
  getMe,
} from "~/features/user/api/user"
import {
  api,
} from "~/lib/modules/api"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent,
} from "~/shared/components/ui/card"

export function TrialCard() {
  const t = useTranslations("dashboard")
  const router = useRouter()
  const queryClient = useQueryClient()
  const [
    isActivating,
    setIsActivating,
  ] = useState(false)

  const {
    data: userData, isLoading,
  } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  })

  const hasTrialActivated = false
  const activateTrialMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/users/activate-trial")
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getMe"],
      })
      queryClient.invalidateQueries({
        queryKey: ["getWalletBalance"],
      })
      toast.success(t("trial.activationSuccess"))
      router.push("/trial-success")
    },
    onError: () => {
      toast.error(t("trial.activationError"))
    },
    onSettled: () => {
      setIsActivating(false)
    },
  })

  const handleActivateTrial = () => {
    setIsActivating(true)
    activateTrialMutation.mutate()
  }

  if (isLoading || hasTrialActivated) {
    return null
  }

  return (
    <Card className="overflow-hidden shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
      <div className="relative">
        {/* Enhanced sparkle animations */}
        <div className="absolute top-4 left-8 animate-pulse">
          <Sparkles className="size-6 text-yellow-400 opacity-80" />
        </div>

        <div className="absolute bottom-4 right-8 animate-pulse delay-200">
          <Sparkles className="size-5 text-yellow-400 opacity-80" />
        </div>

        <div className="absolute top-1/3 left-1/4 animate-pulse delay-400">
          <Sparkles className="size-4 text-yellow-400 opacity-80" />
        </div>

        <div className="absolute top-1/2 right-1/4 animate-pulse delay-600">
          <Sparkles className="size-5 text-yellow-400 opacity-80" />
        </div>

        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-700 p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Gift className="size-8 text-yellow-400" />

                  <h3 className="text-2xl font-extrabold tracking-tight">
                    {t("trial.title")}
                  </h3>
                </div>

                <p className="text-base text-white/90 max-w-md leading-relaxed">
                  {t("trial.description")}
                </p>

                <div className="pt-3 flex justify-center md:justify-start">
                  <Button
                    onClick={handleActivateTrial}
                    disabled={isActivating}
                    size="lg"
                    className="font-semibold bg-yellow-400 hover:bg-yellow-500 text-purple-900 text-lg px-8 py-3 transition-all hover:shadow-xl hover:scale-105"
                  >
                    {
                      isActivating ? (
                        <div className="flex items-center gap-3">
                          <span className="size-5 rounded-full border-2 border-current border-t-transparent animate-spin" />

                          {t("trial.activating")}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          {t("trial.activate")}

                          <ArrowRight className="size-5" />
                        </div>
                      )
                    }
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <span className="text-2xl font-bold text-yellow-400">1,000</span>

                <span className="text-sm font-medium ml-2 text-white/90">
                  {t("trial.credits")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
