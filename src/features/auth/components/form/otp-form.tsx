"use client"

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
  z,
} from "zod"

import {
  useRouter,
} from "~/i18n"
import {
  api,
} from "~/lib/modules/api"
import {
  ErrorMessage,
} from "~/shared/components/shared/error-message"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"
import {
  Input,
} from "~/shared/components/ui/input"
import {
  type ApiResponse,
} from "~/types/api"

// Define the OTP schema
const otpSchema = z.object({
  otp: z.string().length(
    6, "OTP must be 6 characters"
  ),
})

type OtpInput = z.infer<typeof otpSchema>

// Define the props interface
interface OtpFormProps {
  token: string
}

export function AuthOtpForm({ token }: OtpFormProps) {
  const t = useTranslations("auth.otp")
  const router = useRouter()
  const form = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })
  const decodedEmail = decodeURIComponent(token)
  const handleSubmit: SubmitHandler<OtpInput> = async (data) => {
    try {
      const response = await api.post<ApiResponse<null>>(
        "/auth/confirm", {
          token: token, // Use email from props, not form data
          otp: data.otp,
          type: "confirmUser",
        }
      )

      if (response.status) {
        toast.success(response.message || t(
          "success", {
            defaultValue: "OTP verified successfully!",
          }
        ))
        router.push("/login")
      }
      else {
        form.setError(
          "root", {
            message: response.message || t(
              "error", {
                defaultValue: "OTP verification failed",
              }
            ),
          }
        )
      }
    }
    catch (error) {
      form.setError(
        "root", {
          message: (error as Error).message || t(
            "error", {
              defaultValue: "OTP verification failed",
            }
          ),
        }
      )
    }
  }

  const handleResendOtp = async () => {
    try {
      const response = await api.post<ApiResponse<null>>(
        "/auth/resend-otp", {
          email: decodedEmail,
        }
      )
      if (response.status) {
        toast.success(response.message || t(
          "resendSuccess", {
            defaultValue: "OTP resent successfully!",
          }
        ))
      }
      else {
        toast.error(response.message || t(
          "resendError", {
            defaultValue: "Failed to resend OTP",
          }
        ))
      }
    }
    catch {
      toast.error(t(
        "resendError", {
          defaultValue: "Failed to resend OTP",
        }
      ))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="otp"
          render={
            ({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm">
                  {
                    t(
                      "otpLabel", {
                        defaultValue: "One-Time Password (OTP)",
                      }
                    )
                  }
                </FormLabel>

                <FormControl>
                  <Input
                    type="text"
                    placeholder={
                      t(
                        "otpPlaceholder", {
                          defaultValue: "Enter 6-digit OTP",
                        }
                      )
                    }
                    {...field}
                    className="rounded-full text-xs sm:text-sm"
                    maxLength={6}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )
          }
        />

        <ErrorMessage
          variant="destructive"
          message={form.formState.errors.root?.message}
          className="mb-4"
        />

        <Button
          isLoading={form.formState.isSubmitting}
          type="submit"
          className="w-full rounded-full bg-accent text-white text-xs sm:text-sm"
        >
          {
            t(
              "verifyButton", {
                defaultValue: "Verify OTP",
              }
            )
          }
        </Button>

        <div className="my-5 text-center">
          <p className="text-xs">
            {
              t(
                "resendPrompt", {
                  defaultValue: "Didn't receive the OTP?",
                }
              )
            }

            {" "}

            <button
              type="button"
              onClick={handleResendOtp}
              className="text-accent underline font-medium"
            >
              {
                t(
                  "resendLink", {
                    defaultValue: "Resend OTP",
                  }
                )
              }
            </button>
          </p>
        </div>
      </form>
    </Form>
  )
}
