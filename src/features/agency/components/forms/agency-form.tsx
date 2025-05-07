"use client"

import React, {
  useState, useCallback,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  useTranslations,
} from "next-intl"
import {
  type SubmitHandler, useForm,
} from "react-hook-form"
import {
  toast,
} from "sonner"

import {
  registerAgency,
} from "~/features/agency/api/agency"
import {
  useAgencySchemas,
  type AgencyInput,
} from "~/features/agency/types/agency"
import {
  TextInput,
} from "~/shared/components/inputs/text-input"
import {
  copyToClipboardWithMeta,
} from "~/shared/components/shared/copy-button"
import {
  ErrorMessage,
} from "~/shared/components/shared/error-message"
import {
  Alert, AlertDescription, AlertTitle,
} from "~/shared/components/ui/alert"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "~/shared/components/ui/card"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"
import {
  Input,
} from "~/shared/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "~/shared/components/ui/select"
// Define the bank options
const BANK_OPTIONS = [
  {
    label: "Vietcombank",
    value: "VCB",
  },
  {
    label: "Agribank",
    value: "AGR",
  },
  {
    label: "BIDV",
    value: "BIDV",
  },
  {
    label: "Techcombank",
    value: "TCB",
  },
  {
    label: "TPBank",
    value: "TPB",
  },
  {
    label: "VPBank",
    value: "VPB",
  },
  {
    label: "MBBank",
    value: "MBB",
  },
  {
    label: "Sacombank",
    value: "STB",
  },
  {
    label: "ACB",
    value: "ACB",
  },
  {
    label: "Vietinbank",
    value: "CTG",
  },
  {
    label: "OCB",
    value: "OCB",
  },
]

export function AgencyForm() {
  const t = useTranslations("agency")
  const router = useRouter()
  const [
    referralLink,
    setReferralLink,
  ] = useState<string | null>(null)
  const agencySchema = useAgencySchemas()
  // Initialize the form
  const form = useForm<AgencyInput>({
    resolver: zodResolver(agencySchema),
    defaultValues: {
      bankAccount: "",
      bankName: "",
      accountHolder: "",
    },
  })
  const handleBankNameChange = (
    value: string, onChange: (value: string) => void
  ) => {
    onChange(value)
  }
  const handleSubmit: SubmitHandler<AgencyInput> = useCallback(
    async (data) => {
      try {
        const response = await registerAgency(data)

        if (!response.status) {
          return
        }

        toast.success(response.message || t("form.successMessage"))

        const inviteCode = response.data?.inviteCode
        if (!inviteCode) {
          return
        }

        const baseUrl = window.location.origin
        const generatedLink = `${baseUrl}/en/register?inviteCode=${inviteCode}`
        setReferralLink(generatedLink)
      }
      catch (error) {
        form.setError(
          "root", {
            message: (error as Error).message ?? t("form.requestFailed"),
          }
        )
      }
    }, [
      form,
      t,
    ]
  )

  const copyReferralLink = useCallback(
    () => {
      if (referralLink) {
        copyToClipboardWithMeta(referralLink)
        toast.success(t("referral.copied"))
      }
    }, [
      referralLink,
      t,
    ]
  )

  return (
    <div className="max-w-3xl mx-auto">
      {
        referralLink ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold">{t("referral.success")}</CardTitle>

              <CardDescription className="text-center">
                {t("referral.description")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  value={referralLink}
                  readOnly
                  className="bg-white flex-1"
                />

                <Button onClick={copyReferralLink}>{t("referral.copy")}</Button>
              </div>

              <Alert className="bg-blue-500/10 border-blue-500/30">
                {/* <AlertCircle className="size-4 text-blue-500" /> */}

                <AlertTitle>{t("referral.shareTitle")}</AlertTitle>

                <AlertDescription>
                  {t("referral.shareDescription")}
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full"
              >
                {t("referral.backToDashboard")}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold">{t("form.title")}</CardTitle>

              <CardDescription className="text-center">
                {t("form.description")}
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={
                        ({ field }) => (
                          <FormItem>
                            <FormLabel required>{t("form.bankName")}</FormLabel>

                            <Select
                              value={field.value}
                              onValueChange={
                                value => handleBankNameChange(
                                  value, field.onChange
                                )
                              }
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("form.bankNamePlaceholder")} />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent className="bg-white border shadow-md">
                                {
                                  BANK_OPTIONS.map(bank => (
                                    <SelectItem
                                      key={bank.value}
                                      value={bank.value}
                                    >
                                      {bank.label}
                                    </SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )
                      }
                    />

                    <FormField
                      control={form.control}
                      name="bankAccount"
                      render={
                        ({ field }) => (
                          <FormItem>
                            <FormLabel required>{t("form.bankAccount")}</FormLabel>

                            <FormControl>
                              <TextInput
                                {...field}
                                placeholder={t("form.bankAccountPlaceholder")}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )
                      }
                    />

                    <FormField
                      control={form.control}
                      name="accountHolder"
                      render={
                        ({ field }) => (
                          <FormItem>
                            <FormLabel required>{t("form.accountHolder")}</FormLabel>

                            <FormControl>
                              <TextInput
                                {...field}
                                placeholder={t("form.accountHolderPlaceholder")}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )
                      }
                    />
                  </div>

                  <ErrorMessage
                    variant="destructive"
                    message={form.formState.errors.root?.message}
                  />

                  <Alert className="bg-accent/10 border-accent/30">
                    {/* <AlertCircle className="size-4 text-accent" /> */}

                    <AlertTitle>{t("form.note")}</AlertTitle>

                    <AlertDescription>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>{t("form.noteItems.checkInfo")}</li>

                        {/* <li>{t("form.noteItems.approvalProcess")}</li> */}

                        <li>{t("form.noteItems.earnings")}</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </CardContent>

                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                    isLoading={form.formState.isSubmitting}
                  >
                    {t("form.submit")}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        )
      }

      <div className="mt-6 p-4 bg-accent/10 rounded-lg">
        <h3 className="font-semibold mb-2">
          {t("form.benefitsTitle")}
          :
        </h3>

        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>{t("form.benefits.commission")}</li>

          <li>{t("form.benefits.dashboard")}</li>

          <li>{t("form.benefits.support")}</li>
        </ul>
      </div>
    </div>
  )
}
