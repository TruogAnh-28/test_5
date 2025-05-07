"use client"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  useTranslations,
} from "next-intl"
import {
  type SubmitHandler,
  useForm,
} from "react-hook-form"
import {
  toast,
} from "sonner"

import {
  changePassword,
} from "~/features/auth/api/auth"
import {
  type ChangePasswordInput, changePasswordInputSchema,
} from "~/features/auth/type/auth"
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
  PasswordButton,
  Password,
  PasswordInput,
} from "~/shared/components/ui/password-input"

export function ProfileChangePasswordForm() {
  const t = useTranslations("auth")
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordInputSchema),
    defaultValues: {
      new_password: "",
      old_password: "",
      password_confirm: "",
    },
  })

  const handleSubmit: SubmitHandler<ChangePasswordInput> = async (data) => {
    try {
      // const [
      //   new_password,
      //   old_password,
      // ] = await Promise.all([
      //   cryptoSHA3(data.new_password),
      //   cryptoSHA3(data.old_password),
      // ])

      const response = await changePassword({
        newPassword: data.new_password,
        currentPassword: data.old_password,
      })

      if (response.status) {
        toast.success(response.message || t("changePassword.success"))
        form.reset()
      }
    }
    catch (error) {
      form.setError(
        "root", {
          message: (error as Error).message ?? t("changePassword.errors.changeFailed"),
        }
      )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="old_password"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel>{t("changePassword.oldPassword")}</FormLabel>

                  <FormControl>
                    <Password>
                      <PasswordInput {...field} />

                      <PasswordButton />
                    </Password>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
            }
          />

          <FormField
            control={form.control}
            name="new_password"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel>{t("changePassword.newPassword")}</FormLabel>

                  <FormControl>
                    <Password>
                      <PasswordInput {...field} />

                      <PasswordButton />
                    </Password>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
            }
          />

          <FormField
            control={form.control}
            name="password_confirm"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel>{t("changePassword.confirmPassword")}</FormLabel>

                  <FormControl>
                    <Password>
                      <PasswordInput {...field} />

                      <PasswordButton />
                    </Password>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
            }
          />

          <ErrorMessage
            variant="destructive"
            message={form.formState.errors.root?.message}
          />

          <div className="text-end">
            <Button
              disabled={!form.formState.isDirty}
              isLoading={form.formState.isSubmitting}
              type="submit"
              className="w-full md:w-auto"
            >
              {t("changePassword.changeButton")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
