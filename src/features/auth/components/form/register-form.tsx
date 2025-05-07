"use client"

import {
  useState, useEffect,
} from "react"

import {
  useSearchParams,
} from "next/navigation"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  Mail,
} from "lucide-react"
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
  Link,
} from "~/i18n"
import {
  api,
} from "~/lib/modules/api"
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
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"
import {
  Input,
} from "~/shared/components/ui/input"
import {
  PasswordButton, Password, PasswordInput,
} from "~/shared/components/ui/password-input"
import {
  type ApiResponse,
} from "~/types/api"

const registerSchema = z
  .object({
    username: z.string().min(
      1, "Username is required"
    ),
    email: z.string().email("Invalid email format"),
    password: z.string().min(
      6, "Password must be at least 6 characters"
    ),
    password_confirm: z.string().min(
      1, "Please confirm your password"
    ),
    inviteCode: z.string().optional(),
  })
  .refine(
    data => data.password === data.password_confirm, {
      message: "Passwords do not match",
      path: ["password_confirm"],
    }
  )

type RegisterInput = z.infer<typeof registerSchema>

export function AuthRegisterForm() {
  const t = useTranslations("auth.register")
  const [
    registrationSuccess,
    setRegistrationSuccess,
  ] = useState(false)
  const [
    registeredEmail,
    setRegisteredEmail,
  ] = useState("")
  const searchParams = useSearchParams()

  const inviteCode = searchParams.get("inviteCode")

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password_confirm: "",
      inviteCode: inviteCode || "",
    },
  })

  useEffect(
    () => {
      if (inviteCode) {
        form.setValue(
          "inviteCode", inviteCode
        )
      }
    }, [
      inviteCode,
      form,
    ]
  )

  const handleSubmit: SubmitHandler<RegisterInput> = async (data) => {
    try {
      const response = await api.post<ApiResponse<null>>(
        "/auth/register", {
          username: data.username,
          email: data.email,
          password: data.password,
          inviteCode: inviteCode,
        }
      )

      if (response.status) {
        toast.success(response.message
          || t(
            "success", {
              defaultValue: "Registration successful!",
            }
          ))
        setRegisteredEmail(data.email)
        setRegistrationSuccess(true)
      }
    }
    catch (error) {
      form.setError(
        "root", {
          message:
          (error as Error).message
          || t(
            "error", {
              defaultValue: "Registration failed",
            }
          ),
        }
      )
    }
  }

  if (registrationSuccess) {
    return (
      <div className="space-y-6">
        <Alert className="bg-green-50 border-green-200">
          <Mail className="size-5 text-green-600" />

          <AlertTitle className="font-medium text-green-800">
            {
              t(
                "verificationRequired", {
                  defaultValue: "Email Verification Required",
                }
              )
            }
          </AlertTitle>

          <AlertDescription className="text-green-700 mt-2">
            {
              t(
                "checkEmail", {
                  defaultValue: "Please check your email address",
                  email: registeredEmail,
                }
              )
            }

            <span className="font-medium">
              {registeredEmail}
            </span>

            {
              t(
                "forVerification",
                {
                  defaultValue: "for verification instructions to complete your registration.",
                }
              )
            }
          </AlertDescription>
        </Alert>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {
              t(
                "didntReceiveEmail", {
                  defaultValue: "Didn't receive the email?",
                }
              )
            }
          </p>

          <Button
            variant="link"
            className="text-accent p-0 h-auto font-medium"
            onClick={
              () => {
                toast.info(t(
                  "emailResent", {
                    defaultValue: "Verification email resent!",
                  }
                ))
              }
            }
          >
            {
              t(
                "resendEmail", {
                  defaultValue: "Resend verification email",
                }
              )
            }
          </Button>
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="text-accent underline font-medium text-sm"
          >
            {
              t(
                "backToLogin", {
                  defaultValue: "Back to Login",
                }
              )
            }
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            control={form.control}
            name="username"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">
                    {
                      t(
                        "username", {
                          defaultValue: "Username",
                        }
                      )
                    }
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="text"
                      placeholder={
                        t(
                          "usernamePlaceholder", {
                            defaultValue: "Enter username",
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

          {/* Row 1, Column 2: Email */}
          <FormField
            control={form.control}
            name="email"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">
                    {
                      t(
                        "email", {
                          defaultValue: "Email",
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
                            defaultValue: "example@mail.com",
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

          {/* Row 2, Column 1: Password */}
          <FormField
            control={form.control}
            name="password"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">
                    {
                      t(
                        "password", {
                          defaultValue: "Password",
                        }
                      )
                    }
                  </FormLabel>

                  <FormControl>
                    <Password>
                      <PasswordInput
                        placeholder={
                          t(
                            "passwordPlaceholder", {
                              defaultValue: "Password",
                            }
                          )
                        }
                        {...field}
                        className="rounded-full text-xs sm:text-sm"
                      />

                      <PasswordButton />
                    </Password>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
            }
          />

          {/* Row 2, Column 2: Confirm Password */}
          <FormField
            control={form.control}
            name="password_confirm"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">
                    {
                      t(
                        "confirmPassword", {
                          defaultValue: "Confirm Password",
                        }
                      )
                    }
                  </FormLabel>

                  <FormControl>
                    <Password>
                      <PasswordInput
                        placeholder={
                          t(
                            "confirmPasswordPlaceholder", {
                              defaultValue: "Confirm password",
                            }
                          )
                        }
                        {...field}
                        className="rounded-full text-xs sm:text-sm"
                      />

                      <PasswordButton />
                    </Password>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
            }
          />
        </div>

        {
          inviteCode ? (
            <div className="mb-4">
              <FormField
                control={form.control}
                name="inviteCode"
                render={
                  ({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        {
                          t(
                            "agencyCode", {
                              defaultValue: "Referred by Agency",
                            }
                          )
                        }
                      </FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-full text-xs sm:text-sm bg-muted"
                          readOnly
                        />
                      </FormControl>

                      <p className="text-xs text-muted-foreground mt-1">
                        {
                          t(
                            "agencyCodeInfo", {
                              defaultValue: "You were referred by an agency partner",
                            }
                          )
                        }
                      </p>

                      <FormMessage />
                    </FormItem>
                  )
                }
              />
            </div>
          ) : null
        }

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
              "registerButton", {
                defaultValue: "Register",
              }
            )
          }
        </Button>

        <div className="my-5 text-center">
          <p className="text-xs">
            {
              t(
                "alreadyHaveAccount", {
                  defaultValue: "Already have an account?",
                }
              )
            }

            {" "}

            <Link
              href="/login"
              className="text-accent underline font-medium"
            >
              {
                t(
                  "loginLink", {
                    defaultValue: "Login",
                  }
                )
              }
            </Link>
          </p>
        </div>
      </form>
    </Form>
  )
}
