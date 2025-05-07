"use client"

import {
  useRouter,
} from "next/navigation"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  signIn,
} from "next-auth/react"
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
  type LoginInput, loginInputSchema,
} from "~/features/auth/type/auth"
import {
  Link,
} from "~/i18n"
import {
  ErrorMessage,
} from "~/shared/components/shared/error-message"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/ui/form"
import {
  Input,
} from "~/shared/components/ui/input"
import {
  PasswordButton,
  Password,
  PasswordInput,
} from "~/shared/components/ui/password-input"

export function AuthLoginForm() {
  const router = useRouter()
  const t = useTranslations("auth.login")

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      const response = await signIn(
        "credentials",
        {
          email: data.email,
          password: data.password,
          redirect: false,
          callbackUrl: "/",
        },
      )

      if (!response?.ok || response.error) {
        form.setError(
          "root", {
            message: response?.error ?? t(
              "errors.loginFailed", {
                defaultValue: "Login failed",
              }
            ),
          }
        )
        return
      }

      router.push(response?.url || "/")
    }
    catch (error) {
      toast.error((error as Error).message || t(
        "errors.loginFailed", {
          defaultValue: "Login failed",
        }
      ))
    }

    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="mb-4">
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
                      type="text"
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
        </div>

        <div className="mb-4">
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
        </div>

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
              "loginButton", {
                defaultValue: "Log in",
              }
            )
          }
        </Button>

        <div className="my-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <Link
            href="/reset-password"
            className="text-xs font-medium text-accent underline"
          >
            {
              t(
                "forgotPassword", {
                  defaultValue: "Forgot password?",
                }
              )
            }
          </Link>

          <Link
            href="/register"
            className="text-xs font-medium text-accent underline"
          >
            {
              t(
                "noAccount", {
                  defaultValue: "Don't have an account? Register",
                }
              )
            }
          </Link>
        </div>
      </form>
    </Form>
  )
}
