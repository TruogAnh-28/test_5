"use client"

import React, {
  useState, useEffect,
} from "react"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  useMutation, useQuery,
} from "@tanstack/react-query"
import {
  AlertCircle,
} from "lucide-react"
import {
  useSession,
} from "next-auth/react"
import {
  useTranslations,
} from "next-intl"
import {
  useForm,
} from "react-hook-form"
import {
  toast,
} from "sonner"
import {
  z,
} from "zod"

import {
  createDeposit,
} from "~/features/deposit/api/deposit"
import {
  useVoucher,
} from "~/features/deposit/store/use-voucher"
import {
  PaymentMethod,
  type CreateDepositRequest,
} from "~/features/deposit/type/deposit"
import {
  api,
} from "~/lib/modules/api"
import {
  TextInput,
} from "~/shared/components/inputs/text-input"
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
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "~/shared/components/ui/tabs"

const depositFormSchema = z.object({
  creditAmount: z.number().min(
    1, "Số credit tối thiểu là 10"
  ),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.ONLINE),
  voucherId: z.number().optional(),
})

type DepositFormValues = z.infer<typeof depositFormSchema>

interface Config {
  id: number
  name: string
  value: string
  createdAt: string
  updatedAt: string
}

interface CreditRates {
  vnd_to_credit: number
  usdt_to_credit: number
}

export function DepositForm() {
  const t = useTranslations("deposit")
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [
    voucherCode,
    setVoucherCode,
  ] = useState<string>("")
  const [
    calculatedAmount,
    setCalculatedAmount,
  ] = useState<number>(0)
  const [
    totalCreditAmount,
    setTotalCreditAmount,
  ] = useState<number>(0)

  // Default rates in case API fails
  const [
    rates,
    setRates,
  ] = useState<CreditRates>({
    vnd_to_credit: 5000,
    usdt_to_credit: 1,
  })

  // Fetch configuration from API
  const { data: configsResponse } = useQuery({
    queryKey: ["getConfigs"],
    queryFn: async () => {
      const response = await api.get<{ data: Config[] }>("/configs")
      return response
    },
  })

  // Update rates when configs are loaded
  useEffect(
    () => {
      if (configsResponse?.data) {
        const configs = configsResponse.data
        const vndRate = Number(configs.find(c => c.name === "VND_TO_CREDIT")?.value || rates.vnd_to_credit)
        const usdtRate = Number(configs.find(c => c.name === "USDT_TO_CREDIT")?.value || rates.usdt_to_credit)

        setRates({
          vnd_to_credit: vndRate,
          usdt_to_credit: usdtRate,
        })
      }
    }, [configsResponse]
  )

  const {
    voucherData,
    checkVoucher,
    isLoading: isCheckingVoucher,
    reset: resetVoucher,
  } = useVoucher()

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      creditAmount: 0,
      paymentMethod: PaymentMethod.ONLINE,
      voucherId: 1,
    },
  })

  const watchCreditAmount = form.watch("creditAmount")
  const watchPaymentMethod = form.watch("paymentMethod")

  useEffect(
    () => {
      const creditAmount = parseFloat(watchCreditAmount?.toString() || "0") || 0
      if (voucherData?.status === "ACTIVE") {
        setTotalCreditAmount(creditAmount + (creditAmount * voucherData.value / 100))
      }
      else {
        setTotalCreditAmount(creditAmount)
      }

      let amount = 0
      if (watchPaymentMethod === PaymentMethod.ONLINE) {
        amount = creditAmount * rates.vnd_to_credit
      }
      else {
        amount = creditAmount * rates.usdt_to_credit
      }

      setCalculatedAmount(amount)
    }, [
      watchCreditAmount,
      watchPaymentMethod,
      voucherData,
      rates,
    ]
  )

  const depositMutation = useMutation({
    mutationFn: (data: CreateDepositRequest) => {
      return createDeposit(data)
    },
    onSuccess: (response) => {
      if (response.data?.checkoutUrl) {
        window.open(
          response.data.checkoutUrl, "_blank"
        )
        toast.success("Đã mở trang thanh toán trong tab mới")
      }
      else {
        toast.success(response.message || "Đã gửi yêu cầu nạp tiền thành công")
      }
      form.reset()
      setVoucherCode("")
      resetVoucher()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi gửi yêu cầu")
    },
  })

  const handleCheckVoucher = () => {
    if (!voucherCode) {
      toast.error(t("voucher.error"))
      return
    }

    checkVoucher(voucherCode)
  }

  const handleTabChange = (value: PaymentMethod) => {
    form.setValue(
      "paymentMethod", value
    )
  }

  const onSubmit = async (data: DepositFormValues) => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để tiếp tục")
      return
    }

    let paymentMethodId = 3
    if (data.paymentMethod === PaymentMethod.USDT_TRC20) {
      paymentMethodId = 1
    }
    if (data.paymentMethod === PaymentMethod.USDT_ERC20) {
      paymentMethodId = 2
    }

    const depositData: CreateDepositRequest = {
      userId: userId,
      amount: calculatedAmount,
      paymentMethodId: paymentMethodId,
      voucherId: voucherData?.id || 1,
    }

    depositMutation.mutate(depositData)
  }

  const formatCurrency = (
    amount: number, method: PaymentMethod
  ) => {
    if (method === PaymentMethod.ONLINE) {
      return amount.toLocaleString("vi-VN") + " đ"
    }
    return amount.toFixed(2) + " USDT"
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">{t("form.title")}</CardTitle>

          <CardDescription className="text-center">
            {t("form.description")}
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Credit amount field */}
              <FormField
                control={form.control}
                name="creditAmount"
                render={
                  ({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel required>{t("form.creditAmount")}</FormLabel>

                      <FormControl>
                        <TextInput
                          {...field}
                          type="number"
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                          placeholder={t("form.enterCreditAmount")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )
                }
              />

              {/* Payment method tabs */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={
                  ({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.selectPaymentMethod")}</FormLabel>

                      <FormControl>
                        <Tabs
                          defaultValue={PaymentMethod.ONLINE}
                          value={field.value}
                          onValueChange={value => handleTabChange(value as PaymentMethod)}
                          className="w-full"
                        >
                          <TabsList className="grid grid-cols-2 mb-6">
                            <TabsTrigger
                              value={PaymentMethod.ONLINE}
                              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                            >
                              {t("form.paymentMethods.online")}
                            </TabsTrigger>

                            <TabsTrigger
                              value={PaymentMethod.USDT_TRC20}
                              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                            >
                              USDT-TRC20
                            </TabsTrigger>

                            {/* <TabsTrigger
                              value={PaymentMethod.USDT_ERC20}
                              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                            >
                              USDT-ERC20
                            </TabsTrigger> */}
                          </TabsList>

                          <TabsContent value={PaymentMethod.ONLINE}>
                            <div className="border border-primary rounded-lg p-4 cursor-pointer bg-primary/5">
                              <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                  <AlertCircle className="size-5 text-primary" />
                                </div>

                                <div className="flex-1">
                                  <h4 className="font-medium">{t("form.paymentMethods.onlineName")}</h4>

                                  <p className="text-sm text-muted-foreground">{t("form.paymentMethods.onlineDesc")}</p>

                                  <p className="text-sm mt-2">
                                    {
                                      t(
                                        "form.rates.creditToVnd", {
                                          rate: rates.vnd_to_credit.toLocaleString(),
                                        }
                                      )
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent
                            value={PaymentMethod.USDT_TRC20}
                            className="space-y-4"
                          >
                            <Alert className="bg-primary/10 border border-primary">
                              <AlertTitle>{t("form.wallet.instructions")}</AlertTitle>

                              <AlertDescription className="text-sm">
                                {t("form.wallet.instructionsDescTrc20")}
                              </AlertDescription>
                            </Alert>

                            <div className="p-4 border rounded-lg">
                              <p className="text-sm">
                                {
                                  t(
                                    "form.rates.creditToUsdt", {
                                      rate: rates.usdt_to_credit,
                                    }
                                  )
                                }
                              </p>

                              <p className="text-sm text-muted-foreground mt-1">
                                {t("form.wallet.networkWarningTrc20")}
                              </p>
                            </div>
                          </TabsContent>

                          {/* <TabsContent
                            value={PaymentMethod.USDT_ERC20}
                            className="space-y-4"
                          >
                            <Alert className="bg-primary/10 border border-primary">
                              <AlertTitle>{t("form.wallet.instructions")}</AlertTitle>

                              <AlertDescription className="text-sm">
                                {t("form.wallet.instructionsDescErc20")}
                              </AlertDescription>
                            </Alert>

                            <div className="p-4 border rounded-lg">
                              <p className="text-sm">
                                {
                                  t(
                                    "form.rates.creditToUsdt", {
                                      rate: rates.usdt_to_credit,
                                    }
                                  )
                                }
                              </p>

                              <p className="text-sm text-muted-foreground mt-1">
                                {t("form.wallet.networkWarningErc20")}
                              </p>
                            </div>
                          </TabsContent> */}
                        </Tabs>
                      </FormControl>
                    </FormItem>
                  )
                }
              />

              {/* Phần Voucher */}
              <div className="mb-6">
                <FormLabel htmlFor="voucher">{t("form.voucherCode")}</FormLabel>

                <div className="flex space-x-2">
                  <Input
                    id="voucher"
                    placeholder={t("form.voucherCodePlaceholder")}
                    value={voucherCode}
                    onChange={e => setVoucherCode(e.target.value)}
                    className={`flex-1 ${voucherData === null ? "" : voucherData?.status === "ACTIVE" ? "border-green-500" : "border-red-500"}`}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCheckVoucher}
                    isLoading={isCheckingVoucher}
                  >
                    {t("form.applyVoucher")}
                  </Button>
                </div>

                {
                  voucherData?.status === "ACTIVE" ? (
                    <p className="text-sm text-green-600 mt-1">
                      {t("voucher.applied")}

                      {" "}

                      {voucherData.value}
                      %
                    </p>
                  ) : null
                }
              </div>

              {/* Display payment amount */}
              {
                calculatedAmount > 0 && (
                  <Alert className="bg-primary/10 border-primary mb-6">
                    <AlertTitle>{t("form.paymentAmount")}</AlertTitle>

                    <AlertDescription className="font-semibold">
                      {
                        formatCurrency(
                          calculatedAmount, watchPaymentMethod
                        )
                      }
                    </AlertDescription>
                  </Alert>
                )
              }

              {
                totalCreditAmount > 0 && (
                  <Alert className="bg-accent/20 border-accent mb-6">
                    <AlertTitle>{t("form.totalAfterDiscount")}</AlertTitle>

                    <AlertDescription className="font-semibold">
                      {totalCreditAmount.toLocaleString()}

                      {" "}

                      credit

                      {
                        voucherData?.status === "ACTIVE" ? (
                          <span className="text-green-600 ml-2">
                            (+
                            {voucherData?.value}
                            %)
                          </span>
                        ) : null
                      }
                    </AlertDescription>
                  </Alert>
                )
              }

              {/* Payment notice */}
              <Alert className="bg-blue-500/10 border-blue-500/30">
                <AlertCircle className="size-4 text-blue-500" />

                <AlertTitle>{t("form.paymentNotice")}</AlertTitle>

                <AlertDescription>
                  {t("form.paymentNoticeDesc")}
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={depositMutation.isPending || !form.formState.isValid || watchCreditAmount <= 0}
                isLoading={depositMutation.isPending}
              >
                {t("form.confirm")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="mt-6 p-4 bg-accent/10 rounded-lg">
        <h3 className="font-semibold mb-2">
          {t("form.note")}
          :
        </h3>

        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>{t("form.noteItems.checkInfo")}</li>

          <li>{t("form.noteItems.processingTime")}</li>

          <li>{t("form.noteItems.support")}</li>
        </ul>
      </div>
    </div>
  )
}
