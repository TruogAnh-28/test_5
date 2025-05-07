"use client"

import React, {
  useState,
} from "react"

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

// Define the password reset schema
const passwordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(
    6, "OTP must be 6 characters"
  ),
  password: z.string().min(
    6, "Password must be at least 6 characters"
  ),
})

type PasswordResetInput = z.infer<typeof passwordResetSchema>

export function PasswordResetForm() {
  const t = useTranslations("auth.passwordReset")
  const router = useRouter()
  const [
    isOtpSent,
    setIsOtpSent,
  ] = useState(false)
  const form = useForm<PasswordResetInput>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
      otp: "",
      password: "",
    },
  })

  const handleGetOtp = async () => {
    const email = form.getValues("email")
    // Validate email before sending
    const emailValidation = z.string().email("Invalid email address").safeParse(email)
    if (!emailValidation.success) {
      form.setError(
        "email", {
          message: "Invalid email address",
        }
      )
      return
    }

    try {
      const decodedEmail = decodeURIComponent(email) // Decode email if encoded
      const response = await api.post<ApiResponse<null>>(
        "/auth/resend-otp", {
          email: decodedEmail,
          type: "forgotPassword",
        }
      )
      if (response.status) {
        toast.success(response.message || t(
          "otpSentSuccess", {
            defaultValue: "OTP sent successfully!",
          }
        ))
        setIsOtpSent(true)
      }
      else {
        toast.error(response.message || t(
          "otpSentError", {
            defaultValue: "Failed to send OTP",
          }
        ))
      }
    }
    catch {
      toast.error(t(
        "otpSentError", {
          defaultValue: "Failed to send OTP",
        }
      ))
    }
  }

  const handleSubmit: SubmitHandler<PasswordResetInput> = async (data) => {
    try {
      const decodedEmail = decodeURIComponent(data.email) // Decode email if encoded
      const response = await api.post<ApiResponse<null>>(
        "/auth/confirm", {
          email: decodedEmail,
          otp: data.otp,
          password: data.password,
          type: "forgotPassword",
        }
      )

      if (response.status === true) {
        toast.success(response.message || t(
          "success", {
            defaultValue: "Password reset successfully!",
          }
        ))
        router.push("/login")
      }
      if (response.status === false) {
        form.setError(
          "root", {
            message: response.message || t(
              "error", {
                defaultValue: "Password reset failed",
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
              defaultValue: "Password reset failed",
            }
          ),
        }
      )
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
          name="email"
          render={
            ({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm">
                  {
                    t(
                      "emailLabel", {
                        defaultValue: "Email Address",
                      }
                    )
                  }
                </FormLabel>

                <FormControl>
                  <Input
                    type="email"
                    placeholder={
                      t(
                        "emailPlaceholder", {
                          defaultValue: "Enter your email",
                        }
                      )
                    }
                    {...field}
                    className="rounded-full text-xs sm:text-sm"
                    disabled={isOtpSent} // Disable email input after OTP is sent
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )
          }
        />

        <Button
          type="button"
          onClick={handleGetOtp}
          disabled={isOtpSent || form.formState.isSubmitting}
          className="w-full rounded-full bg-accent text-white text-xs sm:text-sm"
        >
          {
            t(
              "getOtpButton", {
                defaultValue: "Get OTP",
              }
            )
          }
        </Button>

        {
          isOtpSent ? (
            <React.Fragment>
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
                                defaultValue: "Enter 6-character OTP",
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

              <FormField
                control={form.control}
                name="password"
                render={
                  ({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        {
                          t(
                            "newPasswordLabel", {
                              defaultValue: "New Password",
                            }
                          )
                        }
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="password"
                          placeholder={
                            t(
                              "newPasswordPlaceholder", {
                                defaultValue: "Enter new password",
                              }
                            )
                          }
                          {...field}
                          className="rounded-full text-xs sm:text-sm"
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
                    "resetPasswordButton", {
                      defaultValue: "Reset Password",
                    }
                  )
                }
              </Button>
            </React.Fragment>
          ) : null
        }

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

            {
              isOtpSent ? (
                <button
                  type="button"
                  onClick={handleGetOtp}
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
              ) : null
            }
          </p>
        </div>
      </form>
    </Form>
  )
}
